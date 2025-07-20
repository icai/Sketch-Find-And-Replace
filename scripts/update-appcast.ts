
import fs from 'fs/promises'
import path from 'path'
import { parseStringPromise, Builder } from 'xml2js'
import minimist from 'minimist'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

function log(msg: string) {
  console.log(`\x1b[36m[appcast]\x1b[0m ${msg}`)
}

const EMPTY_APPCAST = {
  rss: {
    $: {
      version: '2.0',
      'xmlns:sparkle': 'http://www.andymatuschak.org/xml-namespaces/sparkle',
    },
    channel: [
      {
        title: ['Plugin Updates'],
        link: ['https://example.com/plugin'],
        description: ['Auto-updates for Sketch Plugin'],
        language: ['en'],
        item: [],
      },
    ],
  },
}

async function main() {
  log('Updating the appcast file')

  const argv = minimist(process.argv.slice(2))
  const tag = argv.tag || process.env.VERSION || 'v0.0.0'
  const repo = argv.repo || process.env.GITHUB_REPOSITORY || 'your/repo'
  const mainFile = argv.main || 'my-plugin.sketchplugin.zip'
  const shortVersion = tag.replace(/^v/, '')
  const appcastPath = path.join(
    process.cwd(),
    (argv.appcast || '.appcast.xml').replace(/^\.\//, '')
  )
  const zipSize = argv.length || '0'
  const pubDate = new Date().toUTCString()
  const downloadUrl =
    argv.downloadUrl ||
    `https://github.com/${repo}/releases/download/${tag}/${mainFile.replace(/ /g, '.')}`

  // 读取或创建 appcast 对象
  let appcastObj
  try {
    const data = await fs.readFile(appcastPath)
    appcastObj = await parseStringPromise(data)
  } catch {
    log(`No valid existing appcast found. Creating a new one.`)
    appcastObj = EMPTY_APPCAST
  }

  // 插入新版本 item
  appcastObj.rss.channel[0].item.unshift({
    title: [`Version ${shortVersion}`],
    pubDate: [pubDate],
    enclosure: [
      {
        $: {
          url: downloadUrl,
          'sparkle:version': shortVersion,
          'sparkle:shortVersionString': shortVersion,
          length: zipSize,
          type: 'application/octet-stream',
        },
      },
    ],
  })

  const builder = new Builder()
  const xml = builder.buildObject(appcastObj)
  await fs.writeFile(appcastPath, xml)
  log(`Written updated appcast to: ${appcastPath}`)

  if (!argv.noGit) {
    await execAsync(`git add "${appcastPath}"`)
    await execAsync(
      `git commit -m "Update .appcast.xml for tag ${tag} :sparkles:" || echo "No changes to commit"`
    )
    log('Committed appcast.xml')
  }
}

main().catch((err) => {
  console.error(`\x1b[31m[appcast]\x1b[0m Error:`, err)
  process.exit(1)
})

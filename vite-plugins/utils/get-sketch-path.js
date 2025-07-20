import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { getConfig } from './tool-config.js'

function appInfoForKey(app, key) {
  const plistPath = path.join(app, 'Contents', 'Info.plist')
  const result = execSync(
    `/usr/libexec/PlistBuddy -c "Print :'${key}'" "${plistPath}"`,
    { encoding: 'utf8' }
  )
  return result.trim()
}

function pathToAppsWithId(id) {
  return execSync(`mdfind kMDItemCFBundleIdentifier == '${id}'`, {
    encoding: 'utf8',
  })
}

export function pathToLatestXCodeBuild() {
  const output = pathToAppsWithId('com.bohemiancoding.sketch3.xcode')
  const apps = output.split('\n')
  return apps.find(app => app.includes('/DerivedData/'))
}

export function pathToLatestApp() {
  const output = pathToAppsWithId('com.bohemiancoding.sketch3')
  let latest = { version: -1 }
  const apps = output.split('\n')

  apps.forEach(app => {
    if (!app) return
    const version = appInfoForKey(app, 'CFBundleVersion')
    if (version > latest.version) {
      latest = { version, app }
    }
  })

  return latest.app || undefined
}

const CACHE = {}

export default function getSketchPath(app) {
  const key = app || 'undefined'
  if (CACHE[key]) {
    return CACHE[key]
  }

  let appPath = app
  const useXCode = app === 'xcode'
  const useLatest = app === 'latest'

  if (!app && getConfig().sketchPath !== '/Applications/Sketch.app') {
    appPath = getConfig().sketchPath
  }

  if ((!appPath && !useLatest) || useXCode) {
    appPath = pathToLatestXCodeBuild()
    if (useXCode && !appPath) {
      console.error('Xcode build not found.')
      process.exit(1)
    }
  }

  if (!appPath || useLatest) {
    appPath = pathToLatestApp()
    if (useLatest && !appPath) {
      console.error('Latest build not found.')
      process.exit(1)
    }
  }

  if (!appPath) {
    appPath = getConfig().sketchPath
  }

  if (!fs.existsSync(appPath)) {
    console.error(`No Sketch application found${appPath ? ` at ${appPath}` : ''}.`)
    process.exit(1)
  }

  CACHE[key] = appPath
  return appPath
}

import path from 'path'
import semver from 'semver'
import { exec } from './utils/exec'
import getSketchPath from './utils/get-sketch-path'

export function sketchtoolRunCommand(
  output: string,
  commandIdentifier: string,
  options: {
    pre?: string
    post?: string
    withoutActivating?: boolean
    waitForExit?: boolean
    withoutWaitingForPlugin?: boolean
    context?: any
    app?: string
    handleError?: boolean
  } = {}
): string {
  let command = ''

  if (options.pre) command += options.pre + ' '

  command += `"${getSketchPath(options.app || process.env.SKETCH_PATH)}/Contents/Resources/sketchtool/bin/sketchtool" run "${output}" "${commandIdentifier}"`

  if (options.withoutActivating) command += ' --without-activating'
  if (options.waitForExit) command += ' --wait-for-exit'
  if (options.withoutWaitingForPlugin) command += ' --without-waiting-for-plugin'

  if (options.context) {
    command += ` --context="${JSON.stringify(options.context).replace(/"/g, '\\"')}"`
  }

  if (options.post) command += ' ' + options.post

  if (options.handleError === false) return command

  const handleError = [
    'if (echo "$res" | grep "Unknown command ‘run’"); then',
    '  echo "Only available on Sketch 43+";',
    'elif (echo "$res" | grep "such file or directory"); then',
    '  echo "Looks like we can\'t find Sketch.app.\\nYou can specify where to look for it by running:\\n\\necho \\"sketchPath: ABSOLUTE/PATH/TO/Sketch.app\\" > ~/.skpmrc";',
    'else',
    '  echo "$res";',
    'fi',
  ].join(' ')

  return `res=$(${command} 2>&1); ${handleError}`
}

interface SketchToolPluginOptions {
  pluginIdentifier?: string
  sketchVersion?: string
  app?: string
  script?: string
}

export function SketchToolVitePlugin(options: SketchToolPluginOptions = {}): import('vite').Plugin {
  return {
    name: 'vite-sketchtool-plugin',
    apply: 'build',

    async buildStart() {
      if (!options.pluginIdentifier) return

      const command = sketchtoolRunCommand(
        path.join(__dirname, './shutdown-plugin.sketchplugin'),
        'shutdown-plugin',
        {
          ...(options.sketchVersion && semver.satisfies(options.sketchVersion, '>= 45.0.0')
            ? { withoutActivating: true }
            : {}),
          context: { pluginIdentifier: options.pluginIdentifier },
          app: options.app,
        }
      )

      try {
        await exec(command, { shell: '/bin/bash' })
      } catch {
        // silently ignore
      }
    },

    async closeBundle() {
      if (!options.script) return

      try {
        const res = await exec(options.script, {
          shell: '/bin/bash',
          maxBuffer: 1024 * 1000,
        })

        if (res.stderr) {
          console.error(res.stderr)
        }

        if (res.stdout.trim().length > 0) {
          res.stdout
            .trim()
            .split('\n')
            .forEach(line => console.log(line))
        }
      } catch (err) {
        console.error(err)
        throw err
      }
    },
  }
}

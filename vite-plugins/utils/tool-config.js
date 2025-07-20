import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import objectAssign from 'object-assign'
import os from 'os'

const homedir = os.homedir()
const CONFIG_FILE_NAME = '.skpmrc'

const DEFAULT_CONFIG = {
  sketchPath: '/Applications/Sketch.app',
  pluginDirectory: `${homedir}/Library/Application Support/com.bohemiancoding.sketch3/Plugins/`,
  logsLocation: `${homedir}/Library/Logs/com.bohemiancoding.sketch3/Plugin Output.log`,
  plugins: {},
  notarisation: undefined,
}

export function getConfig() {
  const homePath = path.join(homedir, CONFIG_FILE_NAME)
  const localPath = path.join(process.cwd(), CONFIG_FILE_NAME)

  const homeConfig = fs.existsSync(homePath)
    ? yaml.load(fs.readFileSync(homePath, 'utf8'))
    : {}

  const localConfig = fs.existsSync(localPath)
    ? yaml.load(fs.readFileSync(localPath, 'utf8'))
    : {}

  return objectAssign({}, DEFAULT_CONFIG, homeConfig, localConfig)
}

export function saveConfig(config) {
  const configToSave = Object.keys(config).reduce((prev, k) => {
    if (config[k] !== DEFAULT_CONFIG[k]) {
      prev[k] = config[k]
    }
    return prev
  }, { plugins: config.plugins })

  fs.writeFileSync(
    path.join(homedir, CONFIG_FILE_NAME),
    yaml.dump(configToSave),
    'utf8'
  )
}

export function deleteConfig() {
  fs.unlinkSync(path.join(homedir, CONFIG_FILE_NAME))
}

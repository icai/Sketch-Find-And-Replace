// 加载 .babelrc 或 fallback 的 babel 配置

import path from 'path'
import fs from 'fs'

export function loadUserBabelConfig() {
  const babelrcPath = path.resolve(process.cwd(), '.babelrc')
  let userDefinedConfig = {}

  try {
    if (fs.existsSync(babelrcPath)) {
      userDefinedConfig = JSON.parse(fs.readFileSync(babelrcPath, 'utf8'))
    } else {
      userDefinedConfig = {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                safari: '8',
              },
              modules: false,
            },
          ],
        ],
        plugins: [
          '@babel/plugin-transform-async-generator-functions',
          '@babel/plugin-transform-export-namespace-from',
          '@babel/plugin-transform-object-rest-spread',
          [
            '@babel/plugin-transform-runtime',
            {
              regenerator: true,
            },
          ],
        ],
      }
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  return userDefinedConfig
}

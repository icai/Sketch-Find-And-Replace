// vite-plugin-onrun-define.ts
import type { Plugin } from 'vite'

export interface OnRunDefineOptions {
  definedKeys: string[]
}

export function vitePluginOnRunDefine(options: OnRunDefineOptions): Plugin {
  const keys = options.definedKeys && options.definedKeys.length > 0 ? options.definedKeys : ['onRun']
  const primaryKey = keys[0]
  const moduleExportsRegex = /module.exports\s*=/g
  const exportsAssignRegex = /(?<![.\w$])exports.([a-zA-Z0-9_$]+)\s*=/g
  return {
    name: 'vite-plugin-onRun-define',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {

      for (const fileName in bundle) {
        const chunk = bundle[fileName]
        if (chunk.type !== 'chunk') continue

        let code = chunk.code

        // 1. 替换 module.exports = ...
        code = code.replace(moduleExportsRegex, (_) => {
          console.log(_)
          return `globalThis['${primaryKey}'] = `
        })

        code = code.replace(exportsAssignRegex, (_, prop) => {
          console.log(_)
          if (prop === 'default') {
            return `globalThis['${primaryKey}'] =`
          }
          return `globalThis['${prop}'] =`
        })

        chunk.code = code
      }
    }
  }
}

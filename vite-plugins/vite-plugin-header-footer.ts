import { Plugin } from 'vite'

export function HeaderFooterPlugin(definedKeys: string[]): Plugin {
  const header = `var globalThis = this;
var global = this;
function createModule() {
  const module = { exports: {} };

  // 代理 exports，确保对 exports 的赋值同步到 module.exports
  const exports = new Proxy(module.exports, {
    set(target, prop, value) {
      target[prop] = value;
      module.exports[prop] = value; // 确保 module.exports 同步
      return true;
    },
    get(target, prop) {
      return module.exports[prop]; // 始终以 module.exports 为源
    }
  });

  return { module, exports };
}
function __skpm_run (key, context) {
  globalThis.context = context;
  try {
    const { module, exports } = createModule();
   (function(module, exports) {
`

  const footer = (keys: string[]) =>
    `
    })(module, exports);
    const result = module.exports;
    if (key === 'default' && typeof result === 'function') {
      result(context);
    } else if (typeof result[key] !== 'function') {
      throw new Error('Missing export named "' + key + '". Your command should contain something like \`export function " + key +"() {}\`.');
    } else {
      result[key](context);
    }
  } catch (err) {
    if (typeof process !== 'undefined' && process.listenerCount && process.listenerCount('uncaughtException')) {
      process.emit("uncaughtException", err, "uncaughtException");
    } else {
      throw err
    }
  }
}
` +
    keys
      .map(k => {
        if (k === 'onRun' || k === 'run') {
          return `globalThis['${k}'] = __skpm_run.bind(this, 'default')`
        }
        return `globalThis['${k}'] = __skpm_run.bind(this, '${k}')`
      })
      .join(';\n')

  return {
    name: 'vite-plugin-header-footer',

    // 处理每个 chunk 代码，返回修改后的代码
    generateBundle(_, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName]
        if (chunk.type === 'chunk' && chunk.code) {
          chunk.code = header + '\n' + chunk.code + '\n' + footer(definedKeys)
        }
      }
    },
  }
}

import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import { vitePluginOnRunDefine } from './vite-plugins/vite-plugin-sketch-define'



export default defineConfig({
  plugins: [
    vitePluginOnRunDefine({
      definedKeys: ['onRun']
    }),
    {
      name: 'sketch-copy-assets',
      closeBundle() {
        fs.copyFileSync(
          path.resolve(__dirname, 'src/manifest.json'),
          path.resolve(__dirname, 'Find-and-replace.sketchplugin/Contents/Sketch/manifest.json')
        )
      }
    },

  ],
  resolve: {
    alias: {
      // events: '@skpm/events',
      // path: '@skpm/path',
      // fs: '@skpm/fs',
      // os: '@skpm/os',
    }
  },
  build: {
    // target: 'es6',
    sourcemap: false,
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/Find-and-replace.js'),
      formats: ['cjs'],
      fileName: () => `Find-and-replace.js`
    },
    outDir: 'Find-and-replace.sketchplugin/Contents/Sketch',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        strict: false,
        // globals: {
        //   'sketch/ui': 'require("sketch/ui")',
        //   'sketch/dom': 'require("sketch/dom")',
        //   'sketch/settings': 'require("sketch/settings")',
        //   'sketch': 'require("sketch")',
        // },
      },
      external: [
        'events',
        // 'path',
        'sketch/ui',
        'sketch/dom',
        'sketch/settings',
      ]
    }
  }
})

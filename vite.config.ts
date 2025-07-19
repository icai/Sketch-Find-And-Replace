import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'
import { moveScriptToBodyPlugin } from './vite-plugins/move-script-to-body'

function removeCrossoriginPlugin(): import('vite').Plugin {
  return {
    name: 'remove-crossorigin',
    transformIndexHtml(html) {
      // 全局替换 crossorigin（无论是 script 还是 link）
      return html.replace(/\s*crossorigin(?:="[^"]*")?/gi, '')
    }
  }
}


export default defineConfig({
  base: './',
  plugins: [
    vue(),
    moveScriptToBodyPlugin(),
    {
      name: 'sketch-copy-assets',
      closeBundle() {
        // assets/icon.png
        // copy to  Find-and-replace.sketchplugin/Contents/Resources/icon.png
        fs.copyFileSync(
          path.resolve(__dirname, 'assets/icon.png'),
          path.resolve(__dirname, 'Find-and-replace.sketchplugin/Contents/Resources/icon.png')
        )
      }
    },
    // removeCrossoriginPlugin(),

  ],
  // assets/icon.png copy
  build: {
    sourcemap: false,
    minify: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'resources/index.html'),
      output: {
        format: 'cjs',
        assetFileNames: (info) => {
          if (info.name && info.name.endsWith('.css')) {
            return 'assets/[name][extname]'
          }
          return 'assets/[name][extname]'
        },
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
      },
    },
    outDir: 'Find-and-replace.sketchplugin/Contents/Resources',
    emptyOutDir: true
  },
  server: {
    open: '/resources/index.html', // 自动打开 UI 页面
    fs: {
      strict: false
    }
  }
})

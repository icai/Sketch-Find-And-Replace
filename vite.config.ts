import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'
import { moveScriptToBodyPlugin } from './vite-plugins/move-script-to-body'


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
          // 把非 HTML 文件放入 assets
          if (info.name && info.name.endsWith('.css')) {
            return 'assets/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
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

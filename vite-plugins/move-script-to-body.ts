// plugins/moveScriptToBodyPlugin.ts
import fs from 'fs'
import { parse } from 'node-html-parser'
import type { Plugin } from 'vite'

export function moveScriptToBodyPlugin(): Plugin {
  return {
    name: 'move-script-to-body',
    enforce: 'post',
    apply: 'build',
    generateBundle(_, bundle) {
      for (const [fileName, file] of Object.entries(bundle)) {
        if (!fileName.endsWith('.html') || file.type !== 'asset') continue

        const html = file.source?.toString()
        if (!html) continue

        const root = parse(html)

        const head = root.querySelector('head')
        const body = root.querySelector('body')
        if (!head || !body) continue

        // 获取所有 script 和 link 标签
        const scripts = root.querySelectorAll('script')
        const links = root.querySelectorAll('link[rel="stylesheet"]')

        for (const el of [...scripts, ...links]) {
          // 移除 type="module" 和 crossorigin
          if (el.getAttribute('type') === 'module') el.removeAttribute('type')
          if (el.hasAttribute('crossorigin')) el.removeAttribute('crossorigin')
        }

        // 移动 <script> 到 </body> 前
        for (const script of scripts) {
          // 不重复 append 到 body
          if (script.parentNode !== body) {
            script.remove() // 从原处移除
            body.appendChild(script) // 插入到 body 最后
          }
        }

        // 更新最终 HTML
        file.source = root.toString()
      }
    }
  }
}

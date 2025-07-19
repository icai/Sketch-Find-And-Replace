import fs from 'fs'
import path from 'path'
import os from 'os'

const pluginName = 'Find-and-replace.sketchplugin'  // 与 link-plugin 保持一致
const sketchPluginDir = path.join(os.homedir(), 'Library', 'Application Support', 'com.bohemiancoding.sketch3', 'Plugins')
const targetLink = path.join(sketchPluginDir, pluginName)

try {
  if (fs.existsSync(targetLink)) {
    fs.rmSync(targetLink, { recursive: true, force: true })
    console.log(`🗑️ 已删除 Sketch 插件: ${targetLink}`)
  } else {
    console.log(`ℹ️ 未找到插件: ${targetLink}`)
  }
} catch (err) {
  console.error('❌ 删除 Sketch 插件失败:', err)
  process.exit(1)
}

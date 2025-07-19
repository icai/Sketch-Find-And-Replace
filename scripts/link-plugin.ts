// scripts/link-plugin.js
import fs from 'fs'
import path from 'path'
import os from 'os'

const pluginName = 'Find-and-replace.sketchplugin'  // 改成你的插件目录名
const projectRoot = path.resolve(process.cwd())
const pluginDir = path.resolve(projectRoot, pluginName)
const sketchPluginDir = path.join(os.homedir(), 'Library', 'Application Support', 'com.bohemiancoding.sketch3', 'Plugins')
const targetLink = path.join(sketchPluginDir, pluginName)

try {
  if (!fs.existsSync(pluginDir)) {
    console.error(`❌ 插件构建目录不存在: ${pluginDir}`)
    process.exit(1)
  }

  if (!fs.existsSync(sketchPluginDir)) {
    fs.mkdirSync(sketchPluginDir, { recursive: true })
    console.log(`📁 创建 Sketch 插件目录: ${sketchPluginDir}`)
  }

  // 如果已有链接或目录，先删除
  if (fs.existsSync(targetLink)) {
    fs.rmSync(targetLink, { recursive: true, force: true })
    console.log(`⚠️ 删除已有的插件链接或目录: ${targetLink}`)
  }

  fs.symlinkSync(pluginDir, targetLink, 'dir')
  console.log(`✅ 成功创建符号链接: \n  ${targetLink} -> ${pluginDir}`)
} catch (err) {
  console.error('❌ 创建符号链接失败:', err)
  process.exit(1)
}

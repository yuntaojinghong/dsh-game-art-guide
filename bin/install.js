#!/usr/bin/env node
import { mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const skillSrc = join(__dirname, '..', 'skill', 'SKILL.md')
const targetDir = join(homedir(), '.dsh', 'skills', 'game-art-guide')
const targetFile = join(targetDir, 'SKILL.md')

if (!existsSync(skillSrc)) {
  console.error('错误：找不到 SKILL.md，包可能不完整。')
  process.exit(1)
}

mkdirSync(targetDir, { recursive: true })
copyFileSync(skillSrc, targetFile)

console.log('✓ dsh-game-art-guide 已安装')
console.log('  SKILL.md → ' + targetFile)
console.log('  重启 dsh web 后生效；做游戏时 agent 会自动套用，或在对话中说「用 game-art-guide 规范来做」。')

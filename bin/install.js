#!/usr/bin/env node
/**
 * dsh-game-art-guide 安装脚本
 *
 * 用法：
 *   npx dsh-game-art-guide                 安装到用户级 ~/.dsh/skills/game-art-guide
 *   npx dsh-game-art-guide --project       安装到当前项目 ./.dsh/skills/game-art-guide
 *   npx dsh-game-art-guide --dir <路径>    安装到指定目录
 *   npx dsh-game-art-guide --force         目标已存在时强制覆盖
 *   npx dsh-game-art-guide --dry-run       只打印将要执行的操作
 *
 * 幂等：重复执行不会重复写入；内容已一致时直接跳过。
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(HERE, '..')
const SKILL_DIR = join(PKG_ROOT, 'skill')
const SKILL_NAME = 'game-art-guide'

/* ---------------- 参数解析 ---------------- */
const argv = process.argv.slice(2)
const has = (flag) => argv.includes(flag)
function valueOf(flag) {
  const i = argv.indexOf(flag)
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('-') ? argv[i + 1] : null
}

if (has('--help') || has('-h')) {
  console.log(`dsh-game-art-guide 安装脚本

用法：
  npx dsh-game-art-guide                 安装到用户级 ~/.dsh/skills/${SKILL_NAME}
  npx dsh-game-art-guide --project       安装到当前项目 ./.dsh/skills/${SKILL_NAME}
  npx dsh-game-art-guide --dir <路径>    安装到指定目录
  npx dsh-game-art-guide --force         目标已存在时强制覆盖
  npx dsh-game-art-guide --dry-run       只打印将要执行的操作`)
  process.exit(0)
}

const dryRun = has('--dry-run')
const force = has('--force')

let targetDir
const explicitDir = valueOf('--dir')
if (explicitDir) targetDir = resolve(explicitDir)
else if (has('--project')) targetDir = resolve(process.cwd(), '.dsh', 'skills', SKILL_NAME)
else targetDir = join(homedir(), '.dsh', 'skills', SKILL_NAME)

/* ---------------- 前置校验 ---------------- */
if (!existsSync(SKILL_DIR)) {
  console.error(`错误：找不到 skill 目录 ${SKILL_DIR}，包可能不完整。`)
  process.exit(1)
}

const skillFile = join(SKILL_DIR, 'SKILL.md')
if (!existsSync(skillFile)) {
  console.error('错误：skill/SKILL.md 缺失，包可能不完整。')
  process.exit(1)
}

// frontmatter 校验：name / description 是 dsh 发现 skill 的必要字段
const raw = readFileSync(skillFile, 'utf8')
const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
if (!fm) {
  console.error('错误：SKILL.md 缺少 YAML frontmatter，dsh 无法识别该 skill。')
  process.exit(1)
}
for (const key of ['name', 'description']) {
  if (!new RegExp(`^${key}\\s*:`, 'm').test(fm[1])) {
    console.error(`错误：SKILL.md frontmatter 缺少 "${key}" 字段。`)
    process.exit(1)
  }
}

const version = (() => {
  try {
    return JSON.parse(readFileSync(join(PKG_ROOT, 'package.json'), 'utf8')).version
  } catch {
    return 'unknown'
  }
})()

/* ---------------- 收集待安装文件（整个 skill 目录，支持将来加资源） ---------------- */
function listFiles(dir, base = dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...listFiles(full, base))
    else out.push({ from: full, rel: full.slice(base.length + 1) })
  }
  return out
}

const files = listFiles(SKILL_DIR)

/* ---------------- 幂等判断 ---------------- */
if (existsSync(targetDir) && !force) {
  let identical = true
  for (const f of files) {
    const dst = join(targetDir, f.rel)
    if (!existsSync(dst) || readFileSync(dst, 'utf8') !== readFileSync(f.from, 'utf8')) {
      identical = false
      break
    }
  }
  if (identical) {
    console.log(`✓ 已是最新（v${version}）：${targetDir}`)
    console.log('  如需强制覆盖请加 --force。')
    process.exit(0)
  }
  console.log(`注意：${targetDir} 已存在且内容不同，将覆盖其中的 skill 文件（不影响其他文件）。`)
}

/* ---------------- 执行安装 ---------------- */
if (dryRun) {
  console.log(`[dry-run] 目标目录：${targetDir}`)
  for (const f of files) console.log(`[dry-run]   ${f.rel}`)
  process.exit(0)
}

mkdirSync(targetDir, { recursive: true })
for (const f of files) {
  const dst = join(targetDir, f.rel)
  mkdirSync(dirname(dst), { recursive: true })
  copyFileSync(f.from, dst)
}

/* ---------------- 结果 ---------------- */
const styleCount = (raw.match(/^###\s*\d+\./gm) || []).length
console.log(`✓ dsh-game-art-guide v${version} 已安装`)
console.log(`  目标目录：${targetDir}`)
console.log(`  已写入：${files.map((f) => f.rel).join('、')}`)
if (styleCount) console.log(`  内置风格：${styleCount} 种`)
console.log('  重启 dsh web 后生效；做游戏时 agent 会自动套用，或在对话中说「用 game-art-guide 规范来做」。')
console.log(`  卸载：删除 ${targetDir} 即可。`)

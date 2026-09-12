#!/usr/bin/env node
/**
 * dsh-game-art-guide 自检脚本
 *
 * 用法：npm run verify
 *
 * 检查项：
 *   1. bin/ 与 scripts/ 下 JS 的语法（node --check）
 *   2. package.json 的 bin / files 指向的文件必须真实存在
 *   3. skill/SKILL.md 的 YAML frontmatter 必须含 name / description
 *   4. SKILL.md 中 frontmatter.name 必须与安装目录名一致
 *   5. README 与 SKILL.md 声明的美术风格数量必须一致（防止文档漂移）
 *   6. package.json.version 必须与 CHANGELOG.md 最新版本条目一致
 *   7. 安装脚本的端到端行为（安装到临时目录 + 幂等复跑）
 *
 * 退出码：0 = 全部通过；1 = 存在失败项。
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const warnings = [];
const passes = [];

const rel = (p) => p.replace(ROOT + '\\', '').replace(ROOT + '/', '');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const readIf = (p) => (existsSync(join(ROOT, p)) ? read(p) : null);

const fail = (msg) => failures.push(msg);
const pass = (msg) => passes.push(msg);

/* ---------- 1. 语法检查 ---------- */
for (const file of ['bin/install.js', 'scripts/verify.js']) {
  try {
    execFileSync(process.execPath, ['--check', join(ROOT, file)], { stdio: 'pipe' });
    pass(`语法 OK  ${file}`);
  } catch (err) {
    fail(`语法错误 ${file}\n${err.stderr?.toString().trim()}`);
  }
}

/* ---------- 2. 包清单路径有效性 ---------- */
const pkg = JSON.parse(read('package.json'));
for (const [binName, target] of Object.entries(pkg.bin ?? {})) {
  if (!existsSync(join(ROOT, target))) fail(`bin["${binName}"] 指向的文件不存在：${target}`);
}
for (const f of pkg.files ?? []) {
  if (!existsSync(join(ROOT, f))) fail(`files 中声明的路径不存在：${f}`);
}
if (!failures.some((f) => f.includes('不存在'))) {
  pass(`包清单路径有效（bin + files 共 ${Object.keys(pkg.bin ?? {}).length + (pkg.files ?? []).length} 项）`);
}

/* ---------- 3~5. SKILL.md frontmatter 与风格数一致性 ---------- */
const skill = read('skill/SKILL.md');
const fm = skill.match(/^---\r?\n([\s\S]*?)\r?\n---/);

if (!fm) {
  fail('skill/SKILL.md 缺少 YAML frontmatter');
} else {
  const getField = (key) => {
    const m = fm[1].match(new RegExp(`^${key}\\s*:\\s*(.+)$`, 'm'));
    return m ? m[1].trim() : null;
  };
  for (const key of ['name', 'description', 'whenToUse']) {
    if (!getField(key)) {
      if (key === 'whenToUse') warnings.push('SKILL.md frontmatter 建议补充 whenToUse，帮助 agent 判断触发时机');
      else fail(`SKILL.md frontmatter 缺少 "${key}" 字段`);
    }
  }
  if (getField('name') && getField('name') !== 'game-art-guide') {
    fail(`SKILL.md frontmatter.name = "${getField('name')}"，与安装目录名 "game-art-guide" 不一致`);
  } else if (getField('name')) {
    pass('SKILL.md frontmatter 完整且 name 与目录名一致（game-art-guide）');
  }
  if (getField('description') && !/10\s*种/.test(getField('description'))) {
    warnings.push('SKILL.md description 未声明风格数量，建议写成「10 种美术风格」以便检索');
  }
}

// SKILL.md 里的一级风格小节形如 "### 1. 像素风 Pixel Art"
const skillStyles = (skill.match(/^###\s*\d+\./gm) || []).length;
// README「包含的 N 种风格」段落
const readme = read('README.md');
const readmeDeclared = [...readme.matchAll(/包含的\s*(\d+)\s*种风格/g)].map((m) => Number(m[1]));
// README 正文里「内置 **N 种美术风格**」之类的声明
const readmeInline = [...readme.matchAll(/\*\*(\d+)\s*种美术风格\*\*/g)].map((m) => Number(m[1]));

if (skillStyles === 0) {
  fail('SKILL.md 未找到风格小节（形如 "### 1. xxx"），无法统计风格数量');
} else {
  const mismatched = [...readmeDeclared, ...readmeInline].filter((n) => n !== skillStyles);
  if (mismatched.length) {
    fail(
      `文档与实现风格数量不一致：SKILL.md 实际 ${skillStyles} 种，README 声明 ${[...new Set(mismatched)].join('/')} 种`,
    );
  } else {
    pass(`风格数量一致（README 与 SKILL.md 均为 ${skillStyles} 种）`);
  }
}

/* ---------- 6. 版本号与 CHANGELOG 一致 ---------- */
const changelog = readIf('CHANGELOG.md');
if (!changelog) {
  warnings.push('CHANGELOG.md 不存在，建议为每个版本补记录');
} else {
  const firstVersion = changelog.match(/^##\s*\[(\d+\.\d+\.\d+)\]/m);
  if (!firstVersion) {
    warnings.push('CHANGELOG.md 未找到形如 "## [x.y.z]" 的版本条目');
  } else if (firstVersion[1] !== pkg.version) {
    fail(`版本号不一致：package.json=${pkg.version}，CHANGELOG 最新=${firstVersion[1]}`);
  } else {
    pass(`版本号一致（${pkg.version}）`);
  }
}

/* ---------- 7. 安装脚本端到端 ---------- */
try {
  const tmp = mkdtempSync(join(tmpdir(), 'gag-verify-'));
  const run = () =>
    execFileSync(process.execPath, [join(ROOT, 'bin/install.js'), '--dir', tmp], {
      stdio: 'pipe',
      encoding: 'utf8',
    });

  const first = run();
  if (!existsSync(join(tmp, 'SKILL.md'))) throw new Error('安装后未生成 SKILL.md');

  const second = run();
  if (!/已是最新/.test(second)) throw new Error('重复安装未识别为幂等（应输出「已是最新」）');

  rmSync(tmp, { recursive: true, force: true });
  pass(`安装脚本端到端通过（安装 + 幂等复跑，SKILL.md 共 ${read('skill/SKILL.md').length} 字符）`);
  void first;
} catch (err) {
  fail(`安装脚本端到端失败：${err.message?.trim() || err}`);
}

/* ---------- 输出 ---------- */
for (const p of passes) console.log(`PASS  ${p}`);
for (const w of warnings) console.log(`WARN  ${w}`);
for (const f of failures) console.log(`FAIL  ${f}`);
console.log(`\n${passes.length} 通过, ${failures.length} 失败, ${warnings.length} 提示`);

process.exit(failures.length === 0 ? 0 : 1);

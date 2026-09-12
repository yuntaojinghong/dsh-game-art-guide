<div align="center">

# 🎨 dsh-game-art-guide

**DeepSeek Harness（dsh）技能 · 游戏美术规范**

让 AI 做的游戏不再「像一堆 CSS 色块」——内置 **10 种美术风格**的完整配色系统、
UI 与动画规范、游戏类型针对性建议与中文字体排版，覆盖**手机游戏、网页游戏、游戏模组**。

[![npm](https://img.shields.io/npm/v/dsh-game-art-guide?color=4B7BE5)](https://www.npmjs.com/package/dsh-game-art-guide)
[![npm downloads](https://img.shields.io/npm/dm/dsh-game-art-guide)](https://www.npmjs.com/package/dsh-game-art-guide)
[![CI](https://github.com/yuntaojinghong/dsh-game-art-guide/actions/workflows/ci.yml/badge.svg)](https://github.com/yuntaojinghong/dsh-game-art-guide/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-5FE3C8)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-339933)](https://nodejs.org/)

```bash
npx dsh-game-art-guide
```

</div>

---

## 📑 目录

- [解决的问题](#-解决的问题)
- [包含的 10 种风格](#-包含的-10-种风格)
- [安装](#-安装)
- [使用](#-使用)
- [skill 内容一览](#-skill-内容一览)
- [项目结构](#-项目结构)
- [开发](#-开发)
- [常见问题](#-常见问题)
- [版本记录](#-版本记录)
- [许可证](#-许可证)

---

## 🎯 解决的问题

纯文本模型生成游戏时，默认行为是：用 CSS 纯色块硬画、颜色杂乱、风格前后不统一、动效生硬、
中文字体排版随意。结果是「能跑，但很丑」。

这个 skill 把「美术决策」前置成一条硬约束，强制 agent：

1. **先锁定风格 + 配色，再动手写代码**——风格是骨架，中途换等于推倒重来；
2. **用引擎 / 现成素材 / 程序化生成表现画面**，而不是 CSS 色块硬画；
3. **一套游戏一个风格一个调色板（≤16 色）**，UI、动画、字体走统一规范，交付前逐条自检。

---

## 🖌️ 包含的 10 种风格

每种风格都给出**定位、可直接复制的配色色值、绘制规则、适用游戏类型**四要素：

| # | 风格 | 一句话定位 | 典型适用 |
| --- | --- | --- | --- |
| 1 | **像素风** Pixel Art | 复古颗粒感、整数缩放、无抗锯齿 | 街机、Roguelike、平台跳跃、模组 |
| 2 | **扁平风** Flat / Material | 明亮圆角纯色块、单层柔和投影 | 休闲手游、益智、卡牌 |
| 3 | **霓虹风** Neon | 深色底、高饱和霓虹、发光、几何线 | 音游、科幻射击、跑酷 |
| 4 | **卡通风** Cartoon | 高饱和、粗描边、夸张比例 | 儿童向、派对、养成、消除 |
| 5 | **低多边形** Low-poly | 三角面、柔和光照、扁平几何 | 3D 休闲、模拟经营、风景探索 |
| 6 | **极简风** Minimal | 黑白灰 + 单一强调色、大量留白 | 解谜、策略、禅意游戏 |
| 7 | **国风水墨** Ink / Guofeng | 水墨晕染、留白、宣纸质感、朱砂点缀 | 武侠、仙侠、棋牌、国风解谜 |
| 8 | **赛博朋克** Cyberpunk | 霓虹 + 锈蚀 + 全息 + 雨夜都市 | 赛博主题动作、黑客题材 |
| 9 | **水彩手绘** Watercolor | 柔和晕染、纸纹、手绘笔触 | 绘本、治愈、叙事冒险 |
| 10 | **蒸汽朋克** Steampunk | 黄铜、齿轮、皮革、铆钉、暖光 | 蒸汽朋克解谜、策略、建造 |

风格一旦选定即全程锁定，调色板写进代码顶部常量，全游戏引用。

---

## 📦 安装

### 一键安装（推荐）

```bash
npx dsh-game-art-guide
```

自动安装到用户级 `~/.dsh/skills/game-art-guide/`，**所有项目生效**。

### 安装到当前项目

```bash
npx dsh-game-art-guide --project
```

装到 `./.dsh/skills/game-art-guide/`，只在该项目生效——适合想把 skill 随项目一起提交的场景。

### 其他参数

| 参数 | 作用 |
| --- | --- |
| `--dir <路径>` | 安装到指定目录 |
| `--force` | 目标已存在且内容不同时强制覆盖 |
| `--dry-run` | 只打印将要执行的操作，不写文件 |
| `--help` | 查看帮助 |

安装脚本是**幂等**的：内容已一致时会输出「已是最新」并跳过写入，重复执行不会有副作用。

### 手动安装

skill 是纯 Markdown，把文件放到 skills 目录即可被 dsh 发现：

```bash
# 用户级
mkdir -p ~/.dsh/skills/game-art-guide
cp skill/SKILL.md ~/.dsh/skills/game-art-guide/SKILL.md

# 项目级
mkdir -p <你的项目>/.dsh/skills/game-art-guide
cp skill/SKILL.md <你的项目>/.dsh/skills/game-art-guide/SKILL.md
```

装完**重启 dsh web**。之后做游戏时 agent 会自动看到这个 skill，也可以在对话里显式说
「用 game-art-guide 规范来做」。

### 卸载

删除安装目录即可：

```bash
rm -rf ~/.dsh/skills/game-art-guide      # 用户级
rm -rf ./.dsh/skills/game-art-guide      # 项目级
```

---

## 💬 使用

直接提需求，skill 会被自动套用：

> 做一个像素风贪吃蛇，用 game-art-guide 规范，参考《星露谷》配色。

> 帮我做一个国风水墨的围棋小游戏，注意 UI 层级和缓动。

> 给这个网页游戏换一套赛博朋克风格，配色统一到一套调色板里。

更明确的表达会得到更贴合的产出——**点名风格 + 参考作品**是最有效的一句话写法。

---

## 📚 skill 内容一览

`skill/SKILL.md` 共七个部分：

| 章节 | 内容 |
| --- | --- |
| 核心原则 | 三条硬约束（不用纯色块硬画 / 先定风格配色 / 一游戏一调色板） |
| 一、美术风格库 | 10 种风格的四要素（定位 / 配色色值 / 绘制规则 / 适用类型） |
| 二、配色系统 | 五色定位法（背景 60% / 主色 30% / 强调 / 危险 / 文字）+ HSL 明暗调整规则 |
| 三、UI 与动画规范 | 四层界面层级、按钮与弹窗规范、四条缓动曲线、各场景动效时长 |
| 四、游戏类型要点 | 平台跳跃 / RPG / 塔防 / 三消 / 射击 / 卡牌 / 模拟经营 的针对性提示 |
| 五、中文字体排版 | 字体族优先序、字号层级、字重、中英混排、行高与按钮单行 |
| 六、技术实现与素材 | 引擎选型（Kaplay / Phaser / PixiJS）、粒子与 shader、素材库、程序化生成、模组复用原版资源 |
| 七、交付前自检 | 7 条 checklist，全过才算完成 |

---

## 🗂️ 项目结构

```
dsh-game-art-guide/
├── bin/install.js        # npx 一键安装脚本（幂等、支持 --project/--dir/--dry-run）
├── skill/SKILL.md        # skill 本体：10 种风格全规范
├── scripts/verify.js     # 自检脚本（npm run verify）
├── .github/workflows/    # CI 与 tag 发版流程
├── package.json
├── CHANGELOG.md
├── README.md
└── LICENSE
```

---

## 🛠️ 开发

```bash
git clone https://github.com/yuntaojinghong/dsh-game-art-guide.git
cd dsh-game-art-guide

# 自检：语法 / 包清单 / SKILL.md frontmatter / 风格数一致性 / 版本号 / 安装端到端
npm run verify

# 查看将要发布到 npm 的内容（不会真的发布）
npm pack --dry-run

# 本地试用安装脚本
node bin/install.js --dir /tmp/test-skill
```

**改 SKILL.md 时请注意**：风格数量会被自检脚本与 README 交叉校验。
新增一种风格后，必须同步更新 README 的「包含的 N 种风格」与表格，否则 CI 会失败——这条检查
就是用来防止文档与实现漂移的。

发布新版本：更新 `package.json` 的 `version` → 在 `CHANGELOG.md` 顶部加条目 → 打 tag 推送，
CI 会校验三处版本号一致后自动创建 Release（配置 `NPM_TOKEN` secret 则同时发布到 npm）。

---

## ❓ 常见问题

**Q：装完没生效？**
A：需要**重启 dsh web**。skill 是启动时扫描的，热装不会立即被发现。

**Q：agent 没自动用这个 skill？**
A：在对话里显式点名即可：「用 game-art-guide 规范来做」。也可以直接说出风格名（如「国风水墨」），
`whenToUse` 字段会帮助 agent 判断何时套用。

**Q：能同时装用户级和项目级吗？**
A：可以，项目级优先。两者内容不同时以项目级为准。

**Q：重复执行 `npx dsh-game-art-guide` 会怎样？**
A：幂等。内容一致时输出「已是最新」直接跳过；内容不同时提示将覆盖，加 `--force` 才强制写入。

**Q：支持自定义风格吗？**
A：可以。复制 `skill/SKILL.md` 到安装目录后自行增删风格章节；但请同步更新 README 中的数量声明，
否则本地 `npm run verify` 会报不一致。

**Q：`squash & stretch`、`hit flash` 这些术语是什么？**
A：是动画与打击感的行业惯用手法，SKILL.md 第四章针对各类游戏给出了具体用法。

---

## 📄 版本记录

见 [CHANGELOG.md](./CHANGELOG.md)。

---

## 📜 许可证

[MIT](./LICENSE)

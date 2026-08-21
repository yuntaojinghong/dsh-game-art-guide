# dsh-game-art-guide

一个 DeepSeek Harness（dsh）的 **skill（技能）**，让 AI 做游戏时美术不再简陋——内置 **10 种美术风格**的配色系统、UI/动画规范、游戏类型针对性建议与中文字体排版，覆盖**手机游戏、网页游戏、游戏模组**。

## 解决的问题

AI（纯文本模型）生成游戏时，默认会用 CSS 纯色块硬画、颜色杂乱、风格不统一、动效生硬。这个 skill 强制它：

1. 先锁定风格 + 配色，再动手
2. 用引擎 / 素材 / 程序化生成，而不是纯色块
3. 一套游戏一个风格一个调色板，UI/动画/字体有统一规范，交付前自检

## 安装

### 一键安装（推荐）

```bash
npx dsh-game-art-guide
```

这会自动把 skill 安装到 `~/.dsh/skills/game-art-guide/`。

### 手动安装

skill 是纯 Markdown 文件，放到 skills 目录即可被 dsh 自动发现：

```bash
# 用户级（所有项目生效，推荐）
mkdir -p ~/.dsh/skills/game-art-guide
cp skill/SKILL.md ~/.dsh/skills/game-art-guide/SKILL.md

# 项目级（只在某个项目生效）
mkdir -p <你的项目>/.dsh/skills/game-art-guide
cp skill/SKILL.md <你的项目>/.dsh/skills/game-art-guide/SKILL.md
```

装完**重启 dsh web**，之后做游戏时 Agent 会自动看到这个 skill；也可以在对话里显式说「用 game-art-guide 规范来做」。

## 使用

直接提需求即可，例如：

> 做一个像素风贪吃蛇，用 game-art-guide 规范，参考《星露谷》配色。

## 包含的 10 种风格

像素风 / 扁平风 / 霓虹风 / 卡通风 / 低多边形 / 极简风 / 国风水墨 / 赛博朋克 / 水彩手绘 / 蒸汽朋克

## 目录结构

```
dsh-game-art-guide/
├── bin/install.js     # npx 一键安装脚本
├── skill/SKILL.md     # skill 本体（10 种风格全规范）
├── package.json
├── README.md
└── LICENSE
```

## 许可证

MIT

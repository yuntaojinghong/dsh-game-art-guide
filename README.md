# dsh-game-art-guide

一个 DeepSeek Harness（dsh）的 skill，让 AI 做游戏时美术不再简陋——覆盖**手机游戏、网页游戏、游戏模组**，内置 6 种美术风格（像素 / 扁平 / 霓虹 / 卡通 / 低多边形 / 极简）的配色系统、素材与技术实现指南。

## 解决的问题

AI（纯文本模型）生成游戏时，默认会用 CSS 纯色块硬画、颜色杂乱、风格不统一。这个 skill 强制它：

1. 先锁定风格 + 配色，再动手
2. 用引擎 / 素材 / 程序化生成，而不是纯色块
3. 一套游戏一个风格一个调色板，交付前自检

## 安装

dsh skill 分用户级和项目级，二选一：

```bash
# 用户级（所有项目生效，推荐）
cp -r game-art-guide ~/.dsh/skills/

# 项目级（只在某个项目生效）
cp -r game-art-guide <你的项目>/.dsh/skills/
```

装完**重启 dsh web**，之后做游戏时 Agent 会自动看到这个 skill；也可以在对话里显式说「用 game-art-guide 规范来做」。

## 使用

直接提需求即可，例如：

> 做一个像素风贪吃蛇，用 game-art-guide 规范，参考《星露谷》配色。

## 目录结构

```
dsh-game-art-guide/
├── game-art-guide/    # skill bundle（复制到 ~/.dsh/skills/）
│   └── SKILL.md
├── README.md
└── LICENSE
```

## 许可证

MIT

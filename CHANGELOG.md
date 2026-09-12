# Changelog

本文件记录 dsh-game-art-guide 的所有重要变更。
格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.1.0] - 2026-09-13

### Added

- `scripts/verify.js` 自检脚本：语法检查、包清单路径有效性、SKILL.md frontmatter 完整性、
  **README 与 SKILL.md 的风格数量一致性**、版本号与 CHANGELOG 一致性、安装脚本端到端（含幂等复跑）。
  `npm run verify` 一键执行。
- GitHub Actions：CI 在 Node 18/20/22 上跑自检 + `npm pack --dry-run` 内容校验；
  tag 推送时校验版本号后创建 GitHub Release，配置 `NPM_TOKEN` 后一并发布到 npm。
- 安装脚本新增 `--project`（装到项目级 `.dsh/skills/`）、`--dir <路径>`、`--force`、`--dry-run`、`--help`。
- `CHANGELOG.md`（本文件）、`.gitignore`。

### Changed

- **修正 GitHub 仓库描述**：此前写「6 种风格配色系统」，实际 SKILL.md 已扩充到 10 种。
  自检脚本现已把这条一致性检查固化下来，避免再次漂移。
- 安装脚本加固：
  - 安装前校验 `skill/SKILL.md` 存在且 frontmatter 含 `name` / `description`，缺失时明确报错并退出码 1；
  - 幂等——目标内容已一致时输出「已是最新」并跳过写入，不再无脑覆盖；
  - 递归复制整个 `skill/` 目录而非只复制 `SKILL.md`，为将来加入参考素材预留；
  - 安装结果打印包版本、已写入文件清单与实际风格数量。
- `package.json` 补齐 `repository` / `homepage` / `bugs` / `author` / `publishConfig` 与 `scripts`，
  keywords 收敛为更易检索的词。
- README 重写：加徽章与目录，补充环境要求、项目级安装、卸载、自检与发布流程说明。

## [1.0.0] - 2026-09

### Added

- 首个版本：dsh skill「游戏美术规范」。
- 10 种美术风格配色系统（像素风 / 扁平风 / 霓虹风 / 卡通风 / 低多边形 / 极简风 / 国风水墨 /
  赛博朋克 / 水彩手绘 / 蒸汽朋克），每种含定位、配色色值、绘制规则与适用类型。
- 配色系统（五色定位法）、UI 与动画规范（层级、缓动曲线、动效时长）、
  7 类游戏类型针对性要点、中文字体排版规范、技术实现与素材来源、交付前自检清单。
- `npx dsh-game-art-guide` 一键安装到 `~/.dsh/skills/game-art-guide/`。

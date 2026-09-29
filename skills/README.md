# 示例 Skill

本目录是教程第 6 章用到的示例 Skill。它们只使用 Agent Skills 通用的 `name` 和 `description` 字段，**Claude Code 和 Codex 都能直接使用**。

| Skill | 类型 | 作用 |
|---|---|---|
| [`zh-commit`](zh-commit/SKILL.md) | 任务型 | 检查改动（包括是否误提交了密钥），用中文写提交说明并提交 |
| [`beginner-web`](beginner-web/SKILL.md) | 规范型 | 给新手做网页小项目的规范，第 7 章实战项目会用到。附带一份检查清单，演示"辅助文件按需加载" |

## 安装

把 Skill 文件夹复制到对应工具的 Skill 目录即可：

| 工具 | 对所有项目生效 | 只对当前项目生效 |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `项目/.claude/skills/` |
| Codex | `~/.agents/skills/` | `项目/.agents/skills/` |

详细步骤见教程：[编写自己的 Skill](../docs/06-skills/create.md)。

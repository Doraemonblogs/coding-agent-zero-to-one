---
banner: /images/banners/ch7.webp
verified: 2026-09-29
versions: [Claude Code 2.1.284, Codex CLI 0.158.0]
time: 15 分钟
tested: full
---

<script setup>
import { withBase } from 'vitepress'
</script>

# 第 7 章 · 实战：做一个「小账本」

<PageMeta />

前面几章，你已经学会了安装、配置和基本操作。这一章我们从零开始，用 Agent 完成一个**真正能用的小应用**，把学过的东西串起来。

## 我们要做什么

一个记账网页「**小账本**」：

<figure class="cz-figure" style="max-width:340px;margin-left:auto;margin-right:auto">
  <img :src="withBase('/images/practice/xiaozhangben-mobile.png')" alt="小账本在手机上的效果：顶部是本月收入、支出、结余，中间是记账表单和支出分类占比，下方是按日期分组的明细" loading="lazy">
  <figcaption>作者实测：Claude Code + DeepSeek 按本章步骤做出的小账本（手机上的效果）</figcaption>
</figure>

功能清单：

- **记一笔**：选择收入或支出，填写金额、分类、日期、备注；
- **本月汇总**：显示本月的总收入、总支出和结余；
- **分类占比**：用横条显示各类支出占多少；
- **明细列表**：按日期分组，可以删除记录；
- **切换月份**：查看以前的月份；
- **自动保存**：数据存在浏览器里，刷新、关掉再打开都不会丢；
- **手机和电脑都好用**。

技术上只用 HTML、CSS、JavaScript 三个文件，**不需要安装任何东西**，双击就能在浏览器里打开。

::: tip 为什么选这个项目
它足够简单，一个下午能做完；又足够完整，有界面、有数据、有交互，能练到真实开发中的大部分环节。做完以后你每天都能用上它。
:::

## 你会练到什么

| 环节 | 练习的内容 | 所在页面 |
|---|---|---|
| 准备项目 | 项目级 Skill、`CLAUDE.md` / `AGENTS.md` | 本页 |
| 先规划 | 写需求、用 Plan 模式出方案、审核方案 | [先规划，再动手](./plan) |
| 分步实现 | 一次一个功能、检查改动、用 Skill 提交 | [一步步实现](./build) |
| 调试与收尾 | 描述 bug、看浏览器报错、代码审查、写 README | [调试与收尾](./finish) |

::: info 本章是真实跑出来的
作者用 **Claude Code + DeepSeek（deepseek-v4-pro）** 按本章的步骤，把小账本从头到尾做了一遍：15 步、约 17 分钟、花费 2～4 元。本章里标注"作者实测"的 Agent 回复都来自这次运行，上面的截图也是这次做出来的成品。

你实际看到的回复会不一样，这很正常：同样的需求，每次生成的计划和代码细节都可能不同。重要的是学会**提需求、审核、验收**的方法。

这次运行的全部代码（**Agent 生成，作者没有改动**）和每一步的耗时、用量，都在教程仓库的 [`examples/xiaozhangben/`](https://github.com/doraemonblogs/coding-agent-zero-to-one/tree/main/examples/xiaozhangben) 里，做完后可以对照看看。
:::

## 准备项目

::::: steps

### 创建项目文件夹

```bash
cd ~
mkdir xiaozhangben
cd xiaozhangben
git init
```

### 放入项目专用的 Skill

我们让这个项目自带第 6 章写的 `beginner-web`（新手网页规范）Skill，这样无论谁、用哪个工具打开这个项目，Agent 都会遵守同样的规范。

如果你在第 6 章已经把它装到了用户目录，直接复制过来：

::: code-group
```powershell [Windows]
New-Item -ItemType Directory -Force ".claude\skills", ".agents\skills" | Out-Null
Copy-Item -Recurse "$HOME\.claude\skills\beginner-web" ".claude\skills\"
Copy-Item -Recurse "$HOME\.claude\skills\beginner-web" ".agents\skills\"
```

```bash [macOS / Linux]
mkdir -p .claude/skills .agents/skills
cp -r ~/.claude/skills/beginner-web .claude/skills/
cp -r ~/.claude/skills/beginner-web .agents/skills/
```
:::

::: tip 还没有这个 Skill？
可以直接让 Agent 帮你创建：把 [第 6 章中 beginner-web 的内容](../06-skills/create#进阶-带辅助文件的-skill) 复制给它，告诉它"按这个内容在 `.claude/skills/beginner-web/` 和 `.agents/skills/beginner-web/` 下创建 SKILL.md 和 reference/checklist.md"。
:::

### 写项目说明

在项目根目录创建 `AGENTS.md`，写下这个项目是什么、有什么要求：

```markdown
# 小账本

一个在浏览器里运行的个人记账网页，给自己日常使用。

## 要求
- 始终用简体中文回复
- 我是编程新手，每完成一步都告诉我怎么查看效果
- 遵守项目里的 beginner-web Skill 规范
- 需求和进度记录在 PLAN.md 里，每完成一个阶段更新它
```

再创建 `CLAUDE.md`，只写一行，让 Claude Code 也读取 `AGENTS.md`：

```markdown
@AGENTS.md
```

::: tip 为什么这样安排
Codex 读 `AGENTS.md`，Claude Code 读 `CLAUDE.md`。这样安排后，两个工具读到的是**同一份**说明，只需要维护一个文件（见 [第 4 章](../04-codex/basics#agents-md-给-codex-的项目说明书)）。
:::

### 第一次存档

```bash
git add -A
git commit -m "初始化小账本项目"
```

现在项目的结构是这样的：

```text
xiaozhangben/
├── .agents/skills/beginner-web/    ← Codex 用的项目 Skill
├── .claude/skills/beginner-web/    ← Claude Code 用的项目 Skill
├── AGENTS.md                       ← 项目说明
└── CLAUDE.md                       ← 一行：@AGENTS.md
```

### 启动 Agent，确认准备就绪

在项目文件夹里启动 Claude Code（或 Codex），先问一句：

```text
你看到这个项目的说明和 Skill 了吗？用两三句话告诉我这个项目要做什么、有哪些规范。
```

::: terminal 你会看到（作者实测）
```text
看到了。这个项目叫「小账本」，是一个在浏览器里运行的个人记账网页，给你自己日常记账用的。
规范有：始终用简体中文回复；你是编程新手，所以每完成一步都要告诉你怎么看效果；
遵守 beginner-web Skill（只用原生 HTML/CSS/JavaScript、写中文注释、手机和电脑都能看）；
需求和进度记录在 PLAN.md 里，每完成一个阶段就更新它。
```
:::

它能说出"小账本""原生 HTML/CSS/JavaScript""中文注释"这些内容，说明项目说明和 Skill 都生效了。

:::::

下一步：[先规划，再动手](./plan)

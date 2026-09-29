---
verified: 2026-09-29
versions: [Codex CLI 0.158.0]
time: 25 分钟
tested: none
---

# Codex 第一次上手

<PageMeta />

::: warning 验证情况
作者的测试环境里无法完整运行 Codex 的交互界面，本页的界面文字是根据 Codex 0.158.0 的**源码和命令帮助**整理的（信任文件夹的提示、权限模式名称、斜杠命令都来自源码）。实际界面的排版可能略有出入，以你看到的为准。
:::

## 开始之前

请确认你已经完成了**模型接入**：
- 用 DeepSeek：完成 [Codex 接入 DeepSeek](../05-deepseek/codex)；
- 用 ChatGPT 账号：运行过 `codex` 并完成了登录。

## 完成第一个任务

::::: steps

### 准备练习项目

还是用 `ai-playground` 文件夹，先存一次档：

```bash
cd ~/ai-playground
git add -A
git commit -m "开始练习 Codex"
```

### 启动 Codex

```bash
codex
```

### 信任文件夹

第一次在某个文件夹里启动时，Codex 会询问是否信任它：

::: terminal 你会看到
```text
  Folder access
  ~/ai-playground

  Trust this folder? Codex can read, edit, and run files here,
  subject to your permission settings. Folder settings can run code
  automatically, even without a model request. Continue only if you
  trust these files. Your trust decision will be saved.

› 1. Trust and continue
  2. Quit

  enter continue and create sandbox · esc quit
```
:::

确认是自己的项目后，选择 `1. Trust and continue` 并按 <kbd>Enter</kbd>。你的选择会被保存，以后在这个文件夹启动就不再询问。

### 提出第一个需求

在输入框里输入：

```text
帮我创建一个 index.html，打开后显示一个大号的数字时钟，每秒更新一次。
时钟在页面正中间，背景用柔和的渐变色。
```

::: tip 如果你已经用 Claude Code 做过这个练习
可以换一个需求，比如"创建一个 todo.html，做一个简单的待办清单，可以添加和删除事项"。
:::

### 观察它的工作方式

你可能会发现，Codex **没有问你就直接创建了文件**。这是因为 Codex 用**沙箱**（sandbox）机制来控制风险，而不是每一步都问你：

- 在你信任的文件夹里，Codex 默认可以**直接读写这个文件夹内的文件**；
- 但它**不能修改文件夹以外的文件**，默认**也不能联网**；
- 需要越过这些限制时（比如安装依赖要联网），它才会停下来问你。

Claude Code 默认是"每次修改都问你"，Codex 是"划定范围，范围内自由发挥"。两种思路各有好处，共同的前提是：**有 Git 存档，改坏了随时可以恢复**。

### 检查改动

Codex 有一个专门看改动的命令，在输入框里输入：

```text
/diff
```

它会显示所有改动，**包括新建的文件**。也可以用 `!` 开头直接执行终端命令：

```text
!git diff
```

### 存档

满意的话存档：

```text
!git add -A && git commit -m "Codex 完成的第一个任务"
```

### 退出，以及下次继续

- 退出：输入 `/exit`，或者按 <kbd>Ctrl</kbd> + <kbd>C</kbd>；
- 继续**上一次**的对话：运行 `codex resume --last`；
- 从历史对话列表里**选一个**恢复：运行 `codex resume`，或在 Codex 里输入 `/resume`。

:::::

## 权限设置

在 Codex 里输入 `/permissions`，可以选择 Codex 能做什么。它由两部分组成：

**1. 沙箱：技术上允许它碰什么**

| 界面显示 | 配置值 | 含义 |
|---|---|---|
| Read Only | `read-only` | 只能读文件，不能改 |
| Workspace | `workspace-write` | 可以读写当前项目文件夹，不能改外面的文件，默认不能联网 |
| Full Access | `danger-full-access` | 没有任何限制 |

**2. 审批：什么时候问你**

| 界面显示 | 配置值 | 含义 |
|---|---|---|
| Ask for approval | `on-request` | 需要越过沙箱限制时，停下来问你 |
| Approve for me | `on-request` + 自动审核 | 由一个自动审核模型代替你判断 |
| never | `never` | 从不询问，越界的操作直接失败 |

::: tip 新手建议
保持默认的 **Workspace + Ask for approval** 即可：项目内的改动交给它，有 Git 兜底；越界的操作由你把关。

**不要**使用 Full Access 模式，也不要使用带 `dangerously` 字样的启动参数，除非你完全清楚后果。
:::

启动时也可以直接指定沙箱模式：

```bash
# 只读模式：让它看代码、回答问题，但不改任何东西
codex --sandbox read-only
```

### Plan 模式

输入 `/plan` 切换到 Plan 模式。和 Claude Code 一样，在这个模式下 Codex 先给出方案，你确认后再动手。复杂一点的需求建议先用它。

## 常用操作速查

### 按键和特殊符号

| 操作 | 作用 |
|---|---|
| <kbd>Esc</kbd> | **打断** Codex 当前的操作 |
| <kbd>Esc</kbd> <kbd>Esc</kbd>（输入框为空时） | 回到之前的某条消息重新编辑 |
| `@` | 搜索并引用项目里的文件 |
| `$` | 调用一个 Skill，例如 `$skill-creator`（第 6 章介绍） |
| `!` 开头 | 直接执行终端命令，例如 `!git status` |
| `/` 开头 | 使用斜杠命令 |
| <kbd>Ctrl</kbd> + <kbd>C</kbd> | 退出（可能需要连按两次） |

### 常用斜杠命令

| 命令 | 作用 |
|---|---|
| `/init` | 为项目生成 `AGENTS.md` 说明文件（见下文） |
| `/model` | 选择模型和推理强度 |
| `/permissions` | 设置 Codex 能做什么 |
| `/plan` | 切换到 Plan 模式 |
| `/diff` | 查看改动（包括新建的文件） |
| `/review` | 让 Codex 审查当前的改动，找问题 |
| `/new` | 在当前会话中开始新对话 |
| `/compact` | 压缩对话历史，腾出上下文空间 |
| `/resume` | 恢复之前的对话 |
| `/status` | 查看当前配置和 token 用量 |
| `/skills` | 查看和使用 Skill（第 6 章介绍） |
| `/exit` | 退出 |

## AGENTS.md：给 Codex 的项目说明书

Codex 每次启动会自动读取项目根目录下的 **`AGENTS.md`** 文件，作用和 Claude Code 的 `CLAUDE.md` 一样：写下你希望它每次都遵守的规则。

在 Codex 里输入 `/init` 可以自动生成；也可以手动创建，内容参考 [Claude Code 的 CLAUDE.md 示例](../03-claude-code/basics#手动编写)。

::: tip 两个工具都用？让它们共享一份规则
Claude Code 读 `CLAUDE.md`，Codex 读 `AGENTS.md`。如果两个都用，可以把规则写在 `AGENTS.md` 里，然后在 `CLAUDE.md` 里只写一行：

```markdown
@AGENTS.md
```

Claude Code 支持用 `@文件路径` 的方式引用其他文件，这样两个工具就读到同一份规则了。
:::

## 在 VS Code 里使用

VS Code 扩展商店里搜索 **Codex**（发布者是 OpenAI）可以安装图形界面版本。它和命令行版共用 `~/.codex/config.toml` 配置，第 5 章配置的 DeepSeek 同样适用。

## 小结

你现在应该会：
- ✅ 在项目文件夹里启动 Codex，并信任文件夹
- ✅ 理解 Codex 的沙箱机制，以及它和 Claude Code 的区别
- ✅ 用 `/diff` 查看改动、用 `/permissions` 调整权限
- ✅ 用 `AGENTS.md` 写项目规则

接下来：
- 让 Agent 更专业：[第 6 章 · Skill](../06-skills/)
- 做一个完整的项目：[第 7 章 · 实战项目](../07-practice/)

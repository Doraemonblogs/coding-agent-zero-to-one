---
verified: 2026-09-29
versions: [Claude Code 2.1.284]
time: 25 分钟
tested: partial
---

# Claude Code 第一次上手

<PageMeta />

::: info 验证情况
- ✅ 已实测：启动流程、信任文件夹界面、主界面显示、权限模式切换（Linux，接 DeepSeek 配置）
- ⚠️ 待实测：与模型的真实对话过程（作者的测试环境暂时无法访问 DeepSeek），对话示例为示意
:::

## 开始之前

请确认你已经完成了**模型接入**：
- 用 DeepSeek：完成 [Claude Code 接入 DeepSeek](../05-deepseek/claude-code)；
- 用官方账号：运行过 `claude` 并完成了浏览器登录。

## 完成第一个任务

::::: steps

### 准备练习项目

用第 1 章创建的 `ai-playground` 文件夹做练习。进入文件夹，并先存一次档：

```bash
cd ~/ai-playground
git add -A
git commit -m "开始练习 Claude Code"
```

::: tip 提示 nothing to commit？
说明没有需要存档的改动，是正常的，继续下一步。如果提示 `not a git repository`，先执行一次 `git init`。
:::

### 启动 Claude Code

在项目文件夹里输入：

```bash
claude
```

### 信任文件夹

在一个文件夹里第一次启动时，Claude Code 会询问你是否信任这个文件夹：

::: terminal 你会看到
```text
Accessing workspace:

~/ai-playground

Quick safety check: Is this a project you created or one you trust?
(Like your own code, a well-known open source project, or work from your team).
If not, take a moment to review what's in this folder first.

Claude Code'll be able to read, edit, and execute files here.

❯ No, exit
  Yes, I trust this folder
```
:::

::: warning 默认选中的是 "No, exit"
直接按回车会**退出**。请先按 <kbd>↓</kbd> 选中 `Yes, I trust this folder`，再按 <kbd>Enter</kbd>。
:::

这个确认是有意义的：Claude Code 会读取、修改、执行这个文件夹里的文件。以后打开**别人给你的、来源不明的项目**时，先看看里面有什么，再决定是否信任。

### 认识界面

进入之后，界面大致是这样的：

::: terminal Claude Code 主界面
```text
 Claude Code v2.1.284
 deepseek-v4-pro[1m] · API Usage Billing
 ~/ai-playground
                                              ◈ max · /effort
────────────────────────────────────────────────────────────────
❯ 在这里输入你的需求
────────────────────────────────────────────────────────────────
  ⏸ manual mode on · ? for shortcuts
```
:::

| 位置 | 含义 |
|---|---|
| 第二行 | 当前使用的**模型**。用 DeepSeek 的话，这里显示 DeepSeek 的模型名 |
| 第三行 | 当前的**项目文件夹** |
| `max · /effort` | 模型的**思考深度**，可以用 `/effort` 命令调整 |
| `❯` | 输入框，直接用中文输入需求 |
| 最下面一行 | **权限模式**（后面详细讲）。输入 `?` 可以查看所有快捷键 |

### 提出第一个需求

在输入框里输入下面这段话，按 <kbd>Enter</kbd>：

```text
帮我创建一个 index.html，打开后显示一个大号的数字时钟，每秒更新一次。
时钟在页面正中间，背景用柔和的渐变色。
```

::: tip 想换行怎么办？
直接按 <kbd>Enter</kbd> 会发送。要在输入框里换行，输入 `\` 再按 <kbd>Enter</kbd>；在 Windows Terminal 和 macOS 终端里也可以用 <kbd>Shift</kbd> + <kbd>Enter</kbd>。
:::

### 批准操作

Claude 思考之后，会准备创建文件。在 **Manual（手动）模式**下，它每次要修改文件或执行命令时，都会停下来问你：

::: terminal 你会看到（示意，具体文字可能随版本不同）
```text
● Write(index.html)

 Create file index.html
 ╭──────────────────────────────────────────╮
 │ <!DOCTYPE html>                          │
 │ <html lang="zh-CN">                      │
 │ ...                                      │
 ╰──────────────────────────────────────────╯
 Do you want to create index.html?
 ❯ 1. Yes
   2. Yes, allow all edits during this session (shift+tab)
   3. No, and tell Claude what to do differently (esc)
```
:::

| 选项 | 含义 |
|---|---|
| **1. Yes** | 只批准这一次 |
| **2. 允许本次会话的所有编辑** | 这次会话里再改文件就不问了（执行命令仍然会问） |
| **3. No** | 拒绝，并告诉它应该怎么做 |

先选 `1`，看看它创建的文件内容对不对。熟悉之后再考虑选 `2`。

### 查看结果

文件创建好之后，在浏览器里打开它。可以直接对 Claude 说：

```text
帮我用浏览器打开 index.html
```

它会执行打开命令（执行前同样会问你）。你也可以自己在文件管理器里双击 `index.html`。

### 继续提需求

对结果不满意？直接接着说：

```text
在时钟下面加一行小字，显示今天的日期和星期几，用中文。
```

Claude 会记住之前的对话，在原来的基础上修改。**像和同事对话一样，一步一步提需求**，比一次写一大段要求效果更好。

### 检查改动并存档

改完之后，看看它具体改了什么。在 Claude Code 的输入框里，以 `!` 开头可以直接执行终端命令：

```text
!git diff
```

也可以在 VS Code 的 [源代码管理面板](../01-environment/vscode#查看改动-源代码管理) 里查看，改动会用红绿颜色标出来。

满意的话就存档：

```text
!git add -A && git commit -m "完成数字时钟"
```

::: tip 也可以让 Claude 帮你提交
直接说"帮我把这些改动提交到 git，提交说明用中文"，它会自己执行 git 命令。
:::

### 退出，以及下次继续

- 退出：输入 `/exit`，或者连按两次 <kbd>Ctrl</kbd> + <kbd>C</kbd>；
- 下次回来，继续**上一次**的对话：在项目文件夹里运行 `claude --continue`；
- 从历史对话列表里**选一个**恢复：运行 `claude --resume`，或在 Claude Code 里输入 `/resume`。

:::::

## 看懂 Claude 在做什么

对话过程中，Claude 每使用一次"工具"，界面上就会出现一行 `● 工具名(参数)`。认识这几个最常见的工具，你就能看懂它在干什么：

| 工具 | 在做什么 | 需要你批准吗（Manual 模式） |
|---|---|---|
| `Read(文件)` | 读取文件内容 | 不需要 |
| `Glob(规则)` / `Grep(关键词)` | 按文件名或内容搜索文件 | 不需要 |
| `Write(文件)` | 创建新文件（或整个重写） | 需要 |
| `Edit(文件)` | 修改文件里的一部分 | 需要 |
| `Bash(命令)` / `PowerShell(命令)` | 在终端里执行命令 | 需要（部分只读命令除外） |
| `WebFetch(网址)` / `WebSearch(关键词)` | 读取网页 / 搜索网络 | 需要 |

工具下方以 `⎿` 开头的缩进行，是这个工具的**执行结果**，比如"读取了 42 行""命令输出了什么"。

::: tip 它问你问题时
有时 Claude 会向你提问，并给出几个选项让你选。用 <kbd>↑</kbd> <kbd>↓</kbd> 选择，按 <kbd>Enter</kbd> 确认；都不合适的话，可以选择自己输入回答。认真回答这些问题，结果会好很多。
:::

## 权限模式

按 <kbd>Shift</kbd> + <kbd>Tab</kbd> 可以在几种权限模式之间切换，当前模式显示在输入框下方。

| 模式 | 界面显示 | 什么操作不用问你 | 适合 |
|---|---|---|---|
| Manual（手动） | `⏸ manual mode on` | 只有读文件 | **新手、重要项目**，每一步都自己把关 |
| Accept Edits（自动接受编辑） | `⏵⏵ accept edits on` | 读文件、改文件、常见的文件操作命令 | 已经信任它的改动方向，想少点确认 |
| Plan（计划） | `⏸ plan mode on` | 只读，不改任何东西 | 先让它**出方案**，你确认后再动手 |
| Auto（自动） | `⏵⏵ auto mode on` | 几乎所有操作，由一个安全检查模型代替你审核 | 熟练之后的长任务 |

::: tip 新手建议：用 Manual 模式
Claude Code 从 v2.1.283 开始，默认以 **Auto 模式**启动。Auto 模式依赖一个"安全审核模型"来判断操作是否危险，官方文档写明它只支持部分 Claude 模型；接入 DeepSeek 时能否正常工作，作者没有验证。

所以本教程在 [DeepSeek 配置模板](../05-deepseek/claude-code) 里把默认模式设为了 **Manual**。学习阶段，看着它的每一步操作，本身就是很好的学习过程。
:::

::: tip Plan 模式非常好用
对于稍微复杂一点的需求，先切到 Plan 模式（或者输入 `/plan 你的需求`），让它把打算怎么做写出来。你确认方案没问题，它才会开始改代码。这能避免它"埋头干了半天，方向却是错的"。第 7 章的实战项目会完整演示这个流程。
:::

## 常用操作速查

### 按键

| 按键 | 作用 |
|---|---|
| <kbd>Esc</kbd> | **打断** Claude 当前的操作（发现它方向不对时立即按） |
| <kbd>Esc</kbd> <kbd>Esc</kbd>（输入框为空时连按两次） | 打开**回退**菜单，把对话和代码恢复到之前某一步 |
| <kbd>Shift</kbd> + <kbd>Tab</kbd> | 切换权限模式 |
| `\` 然后 <kbd>Enter</kbd> | 换行（所有终端都可用） |
| <kbd>↑</kbd> / <kbd>↓</kbd> | 翻看之前输入过的内容 |
| <kbd>Ctrl</kbd> + <kbd>C</kbd> | 有操作在进行时是打断；没有时按一次清空输入，按两次退出 |
| <kbd>Ctrl</kbd> + <kbd>V</kbd> | 粘贴剪贴板里的图片（截图）。接 DeepSeek 时可能不支持图片 |

### 输入框里的特殊符号

| 输入 | 作用 | 例子 |
|---|---|---|
| `@` | 引用文件，会弹出文件列表供选择 | `@index.html 这个文件的配色太暗了` |
| `!` | 直接执行终端命令，结果会加入对话 | `!git status` |
| `/` | 使用斜杠命令 | `/help` |

### 常用斜杠命令

| 命令 | 作用 |
|---|---|
| `/help` | 查看帮助和所有可用命令 |
| `/init` | 为项目生成 `CLAUDE.md` 说明文件（见下文） |
| `/clear` | 清空对话，开始一个全新的话题 |
| `/compact` | 压缩对话历史，腾出上下文空间（对话很长时用） |
| `/context` | 查看上下文用了多少 |
| `/model` | 切换模型 |
| `/effort` | 调整思考深度 |
| `/plan` | 进入 Plan 模式 |
| `/resume` | 恢复之前的对话 |
| `/rewind` | 回退对话和代码到之前某一步（同 <kbd>Esc</kbd> <kbd>Esc</kbd>） |
| `/usage` | 查看本次会话的用量 |
| `/skills` | 查看可用的 Skill（第 6 章介绍） |
| `/permissions` | 管理"哪些操作总是允许/总是询问/总是拒绝" |
| `/memory` | 编辑 `CLAUDE.md` 记忆文件 |
| `/config` | 打开设置界面 |
| `/doctor` | 诊断安装和配置问题 |
| `/exit` | 退出 |

::: tip /usage 里的费用仅供参考
接入 DeepSeek 时，Claude Code 显示的费用可能是按 Claude 的价格估算的，**实际花费以 DeepSeek 开放平台的账单为准**。
:::

## CLAUDE.md：给 Claude 的项目说明书

每次新开对话，Claude 都不记得之前的事。如果有些要求你每次都要重复（"用中文回复"、"这个项目用的是 Python"……），可以把它们写进项目根目录的 **`CLAUDE.md`** 文件。Claude Code 每次启动都会自动读取它。

### 自动生成

在 Claude Code 里输入：

```text
/init
```

它会分析项目，自动生成一份 `CLAUDE.md`。

### 手动编写

`CLAUDE.md` 就是一个普通的 Markdown 文本文件，可以直接用 VS Code 编辑。给新手的一个参考：

```markdown
# 项目说明

这是一个学习用的练习项目，包含一些简单的网页。

## 要求
- 始终用简体中文回复，代码注释也用中文
- 我是编程新手，做重要改动之前先简单说明你打算怎么做
- 只用原生 HTML / CSS / JavaScript，不要引入框架或需要安装的依赖
```

::: tip 保持简短
`CLAUDE.md` 每次对话都会被读取，会占用上下文、消耗 token。只写**真正需要每次都遵守**的规则，几十行以内为宜。更长的操作手册适合写成 Skill（见 [第 6 章](../06-skills/)）。
:::

### 全局的 CLAUDE.md

写在 `~/.claude/CLAUDE.md` 里的内容，会对你**所有项目**生效。比如"始终用简体中文回复"这种个人偏好，就适合放在这里。

## 在 VS Code 里使用

如果更喜欢图形界面，可以在 VS Code 的扩展商店搜索 **Claude Code**（发布者是 Anthropic）并安装。它和终端版共用同一套配置，第 5 章配置好的 DeepSeek 在插件里同样有效。

::: warning 待实测
VS Code 插件搭配 DeepSeek 的使用流程，作者没有在真实环境中验证。DeepSeek 官方文档提到，使用插件时需要在 VS Code 设置里勾选 `claudeCode.disableLoginPrompt`，以跳过登录提示。
:::

## 小结

你现在应该会：
- ✅ 在项目文件夹里启动 Claude Code，并信任文件夹
- ✅ 用中文提需求、批准或拒绝它的操作
- ✅ 看懂 `Read`、`Write`、`Edit`、`Bash` 这些工具在做什么
- ✅ 用 <kbd>Esc</kbd> 打断它，用 <kbd>Esc</kbd> <kbd>Esc</kbd> 回退
- ✅ 用 <kbd>Shift</kbd> + <kbd>Tab</kbd> 切换权限模式
- ✅ 用 `git diff` 检查改动，用 `CLAUDE.md` 写项目规则

接下来：
- 想同时学 Codex：[安装 Codex CLI](../04-codex/)
- 让 Agent 更专业：[第 6 章 · Skill](../06-skills/)
- 做一个完整的项目：[第 7 章 · 实战项目](../07-practice/)

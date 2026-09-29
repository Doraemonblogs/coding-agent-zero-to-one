# Claude Code 第一次上手

::: info 版本信息
最后验证：2026-09-29 · Claude Code 2.1.284 · 启动流程和界面文字已在 Linux 上实测
:::

## 开始之前

请确认你已经完成了**模型接入**：
- 用 DeepSeek：完成 [Claude Code 接入 DeepSeek](../05-deepseek/claude-code)；
- 用官方账号：运行过 `claude` 并完成了浏览器登录。

## 第 1 步：准备一个练习项目

用第 1 章创建的 `ai-playground` 文件夹做练习。先进入文件夹，并存一次档：

```bash
cd ~/ai-playground
git add -A
git commit -m "开始练习 Claude Code"
```

::: tip 如果提示 nothing to commit
说明没有需要存档的改动，是正常的，继续下一步即可。
:::

## 第 2 步：启动 Claude Code

在项目文件夹里输入：

```bash
claude
```

### 信任文件夹

在一个文件夹里第一次启动时，Claude Code 会询问你是否信任这个文件夹：

```
Quick safety check: Is this a project you created or one you trust?
...
❯ No, exit
  Yes, I trust this folder
```

::: warning 默认选中的是 "No, exit"
直接按回车会**退出**。请先按 `↓` 方向键，选中 `Yes, I trust this folder`，再按回车。
:::

这个确认是有意义的：Claude Code 会读取、修改、执行这个文件夹里的文件。以后打开**别人给你的、来源不明的项目**时，要先看看里面有什么，再决定是否信任。

### 认识界面

进入之后，界面大致是这样的：

```
 Claude Code v2.1.284
 deepseek-v4-pro[1m] · API Usage Billing
 ~/ai-playground
                                              ◈ max · /effort
────────────────────────────────────────────────────────────────
❯ 在这里输入你的需求
────────────────────────────────────────────────────────────────
  ⏸ manual mode on · ? for shortcuts
```

- 第二行是当前使用的**模型**。用 DeepSeek 的话，这里会显示 DeepSeek 的模型名；
- 右侧的 `max · /effort` 是模型的**思考深度**，可以用 `/effort` 命令调整；
- 中间的 `❯` 是输入框，直接用中文输入需求；
- 最下面一行是**权限模式**（后面详细讲）。输入 `?` 可以查看所有快捷键。

## 第 3 步：完成第一个任务

在输入框里输入下面这段话，按回车：

```text
帮我创建一个 index.html，打开后显示一个大号的数字时钟，每秒更新一次。
时钟在页面正中间，背景用柔和的渐变色。
```

接下来你会看到 Claude Code 开始思考，然后准备创建文件。

### 批准操作

在默认的 **Manual（手动）模式**下，Claude Code 每次要修改文件或执行命令时，都会停下来问你。界面大致是这样（具体文字可能随版本略有不同）：

```
Do you want to create index.html?
❯ 1. Yes
  2. Yes, allow all edits during this session
  3. No, and tell Claude what to do differently
```

- **1. Yes**：只批准这一次；
- **2. 允许本次会话的所有编辑**：这次会话里再改文件就不问了（执行命令仍然会问）；
- **3. No**：拒绝，并告诉它应该怎么做。

先选 `1`，看看它创建的文件内容对不对。熟悉之后再考虑选 `2`。

### 查看结果

文件创建好之后，在浏览器里打开它。可以直接对 Claude Code 说：

```text
帮我用浏览器打开 index.html
```

也可以自己在文件管理器里双击 `index.html`。

### 继续提需求

对结果不满意？直接接着说：

```text
在时钟下面加一行小字，显示今天的日期和星期几，用中文。
```

Agent 会记住之前的对话，在原来的基础上修改。**像和同事对话一样，一步一步提需求**，比一次性写一大段要求效果更好。

## 第 4 步：检查改动并存档

Claude Code 改完之后，看看它具体改了什么。在 Claude Code 的输入框里，以 `!` 开头可以直接执行终端命令：

```text
!git diff
```

也可以在 VS Code 左侧的「源代码管理」面板里查看，改动会用红绿颜色标出来。

满意的话就存档：

```text
!git add -A && git commit -m "完成数字时钟"
```

::: tip 也可以让 Claude Code 帮你提交
直接说"帮我把这些改动提交到 git，提交说明用中文"，它会自己执行 git 命令。
:::

## 第 5 步：退出和恢复

- 退出：输入 `/exit`，或者连按两次 `Ctrl + C`；
- 下次回来，继续**上一次**的对话：在项目文件夹里运行 `claude --continue`；
- 从历史对话列表里**选一个**恢复：运行 `claude --resume`，或在 Claude Code 里输入 `/resume`。

## 权限模式

按 `Shift + Tab` 可以在几种权限模式之间切换，当前模式显示在输入框下方。

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
对于稍微复杂一点的需求，先切到 Plan 模式，让它把打算怎么做写出来。你确认方案没问题，它才会开始改代码。这能避免它"埋头干了半天，方向却是错的"。
:::

## 常用操作速查

### 按键

| 按键 | 作用 |
|---|---|
| `Esc` | **打断** Claude 当前的操作（发现它方向不对时立即按） |
| `Esc` `Esc`（输入框为空时连按两次） | 打开**回退**菜单，把对话和代码恢复到之前某一步 |
| `Shift + Tab` | 切换权限模式 |
| `\` 然后 `Enter` | 换行（所有终端都可用）。Windows Terminal、macOS 终端里 `Shift + Enter` 也可以 |
| `↑` / `↓` | 翻看之前输入过的内容 |
| `Ctrl + C` | 有操作在进行时是打断；没有时按一次清空输入，按两次退出 |

### 输入框里的特殊符号

| 输入 | 作用 | 例子 |
|---|---|---|
| `@` | 引用文件，会弹出文件列表供选择 | `@index.html 这个文件的配色太暗了` |
| `!` | 直接执行终端命令 | `!git status` |
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
| `/resume` | 恢复之前的对话 |
| `/rewind` | 回退对话和代码到之前某一步（同 `Esc Esc`） |
| `/usage` | 查看本次会话的用量 |
| `/permissions` | 管理"哪些操作总是允许/总是询问/总是拒绝" |
| `/memory` | 编辑 `CLAUDE.md` 记忆文件 |
| `/config` | 打开设置界面 |
| `/doctor` | 诊断安装和配置问题 |
| `/exit` | 退出 |

::: tip /usage 里的费用仅供参考
接入 DeepSeek 时，Claude Code 显示的费用可能是按 Claude 的价格估算的，**实际花费以 DeepSeek 开放平台的账单为准**。
:::

## CLAUDE.md：给 Agent 的项目说明书

每次新开对话，Claude Code 都不记得之前的事。如果有些要求你每次都要重复（"用中文回复"、"这个项目用的是 Python"……），可以把它们写进项目根目录的 **`CLAUDE.md`** 文件。Claude Code 每次启动都会自动读取它。

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
`CLAUDE.md` 每次对话都会被读取，会占用上下文、消耗 token。只写**真正需要每次都遵守**的规则，几十行以内为宜。
:::

## 在 VS Code 里使用

如果更喜欢图形界面，可以在 VS Code 的扩展商店搜索 **Claude Code**（发布者是 Anthropic）并安装。它和终端版共用同一套配置，第 5 章配置好的 DeepSeek 在插件里同样有效。

::: warning 待实测
VS Code 插件搭配 DeepSeek 的使用流程，作者没有在真实环境中验证。DeepSeek 官方文档提到，使用插件时需要在 VS Code 设置里勾选 `claudeCode.disableLoginPrompt`，以跳过登录提示。
:::

## 小结

你现在应该会：
- ✅ 在项目文件夹里启动 Claude Code，并信任文件夹
- ✅ 用中文提需求、批准或拒绝它的操作
- ✅ 用 `Esc` 打断它，用 `Esc Esc` 回退
- ✅ 用 `Shift + Tab` 切换权限模式
- ✅ 用 `git diff` 检查改动，用 `CLAUDE.md` 写项目规则

接下来：
- 想同时学 Codex：[安装 Codex CLI](../04-codex/)
- Skill、实战项目和更多技巧：第 6～8 章（即将推出）

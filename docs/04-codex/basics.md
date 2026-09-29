---
verified: 2026-09-29
versions: [Codex CLI 0.158.0]
time: 25 分钟
tested: full
---

# Codex 第一次上手

<PageMeta />

::: info 验证情况
- ✅ 已实测（2026-09-29，Linux，Codex 0.158.0 接 DeepSeek）：本页的整个流程作者都真实操作了一遍，界面文字和对话内容都来自这次实测，只删掉了部分空行
- Codex 更新非常频繁，界面细节可能和你看到的略有不同
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

::: terminal 你会看到（作者实测）
```text
  >_ OpenAI Codex (v0.158.0)
     ~/ai-playground

  （中间是一个 Logo 图案）

› Ask Codex to do anything
  ? for shortcuts
```
:::

`›` 后面就是输入框。

### 提出第一个需求

在输入框里输入下面这段话，按 <kbd>Enter</kbd>：

```text
帮我创建一个 index.html，打开后显示一个大号的数字时钟，每秒更新一次。时钟在页面正中间，背景用柔和的渐变色。
```

::: tip 如果你已经用 Claude Code 做过这个练习
可以换一个需求，比如"创建一个 todo.html，做一个简单的待办清单，可以添加和删除事项"。
:::

### 信任文件夹

在一个文件夹里第一次使用时，Codex 会询问是否信任它（作者实测，是在发送第一条消息之后弹出的）：

::: terminal 你会看到（作者实测）
```text
  Folder access
  ~/ai-playground

  Trust this folder? Codex can read, edit, and run files here, subject to your permission
  settings. Folder settings can run code automatically, even without a model request. Continue
  only if you trust these files. Your trust decision will be saved.

› 1. Trust and continue
  2. Back to Agent Command Center

  enter continue · esc back
```
:::

确认是自己的项目后，选择 `1. Trust and continue` 并按 <kbd>Enter</kbd>。你的选择会被保存，以后在这个文件夹里就不再询问。

### 观察它的工作方式

::: terminal 你会看到（作者实测，节选）
```text
• Explored
  └ Read SKILL.md (beginner-web skill)
    List ls -la
    Read checklist.md

• 我来创建三个文件：index.html、style.css、app.js，实现居中大号数字时钟。

• Ran apply_patch <<'PATCH' …
  └ A index.html
    A style.css
    A app.js

• Ran ls -la index.html style.css app.js && node --check app.js && echo "JS 检查通过"
  └ JS 检查通过

• 已完成，共创建三个文件：
  • index.html：页面结构，包含时钟元素
  • style.css：柔和渐变背景，时钟居中显示
  • app.js：每秒更新时间，JavaScript 语法检查已通过

  查看效果
  直接用浏览器打开 index.html 即可，时钟会显示在页面正中间，每秒更新一次；手机和电脑上都能正常显示。

› Ask Codex to do anything

  deepseek-v4-pro high · ~/ai-playground
  ? for shortcuts                                              ⚠ 2 warnings · f2 to view
```
:::

怎么看懂这段输出：

| 内容 | 含义 |
|---|---|
| `• Explored` | 它在**看**东西：读文件、列目录。这里它先读了作者安装的 `beginner-web` Skill（第 6 章会讲） |
| `• Ran apply_patch` | 它在**改文件**。下面的 `A` 表示新增（Add）的文件，`M` 表示修改，`D` 表示删除 |
| `• Ran 某条命令` | 它**执行了一条命令**，`└` 后面是命令的输出 |
| `+ Show details` | 这一步还有更多细节被折叠了 |
| 底部 `deepseek-v4-pro high` | 当前的模型和推理强度 |
| 右下角 `⚠ 2 warnings` | 有两条提示，按 <kbd>F2</kbd> 查看。通常就是 [第 5 章](../05-deepseek/codex#可能看到的几行提示) 提到的那几条，不影响使用 |

你会发现，Codex **没有问你就直接创建了文件、执行了检查命令**。这是因为 Codex 用**沙箱**（sandbox）机制来控制风险，而不是每一步都问你：

- 在你信任的文件夹里，Codex 默认可以**直接读写这个文件夹内的文件**、执行命令；
- 但它**不能修改文件夹以外的文件**，默认**也不能联网**；
- 需要越过这些限制时，它才会停下来问你（下面"存档"一步就会遇到）。

Claude Code 默认是"每次修改都问你"，Codex 是"划定范围，范围内自由发挥"。两种思路各有好处，共同的前提是：**有 Git 存档，改坏了随时可以恢复**。

### 检查改动

Codex 有一个专门看改动的命令，在输入框里输入：

```text
/diff
```

它会显示所有改动，**包括新建的文件**（这一点比 `git diff` 方便，见 [git diff 看不到新文件](../01-environment/git#修改后查看差异)）。按 <kbd>↑</kbd> <kbd>↓</kbd> 滚动，按 <kbd>q</kbd> 关闭。如果显示 `No changes detected.`，说明所有改动都已经存档了。

也可以用 `!` 开头直接执行终端命令，比如 `!git status`。

### 存档

可以自己执行 `!git add -A && git commit -m "Codex 完成的第一个任务"`，也可以让 Codex 帮你提交。作者让它提交时，遇到了这个询问：

::: terminal 你会看到（作者实测）
```text
• 提交因 .git 目录只读被拦截，需要申请权限后重试。

  Would you like to run the following command?

  Environment: local
  Reason: 是否允许我把当前改动提交到 Git？

  $ git add -A && git commit -m "新功能：创建居中显示的数字时钟页面" -m "- 新增 index.html
  页面结构，包含大号时钟元素
  - 新增 style.css，使用柔和渐变背景并将时钟居中显示
  - 新增 app.js，每秒更新当前时间" && git log --oneline -1

› 1. Yes, proceed (y)
  2. Yes, and don't ask again for commands that start with `git add -A` (p)
  3. No, and tell Codex what to do differently (esc)

  Press enter to confirm or esc to cancel
```
:::

为什么改文件不用问、提交却要问？因为在默认的沙箱里，**项目里的 `.git` 文件夹是只读的**——Codex 可以随便改代码，但"存档"这个动作必须经过你同意。这是一个很好的设计：改坏的代码随时能恢复，存档记录却不会被它悄悄改掉。

读一遍命令里的提交说明，没问题就选 `1`（或直接按 <kbd>y</kbd>）：

::: terminal 你会看到（作者实测）
```text
✔ You approved codex to run git add -A && git commit -m "新功能：创建居中显示的数字时钟页面" ... this time

• Ran git add -A && git commit -m "新功能：创建居中显示的数字时钟页面" -m "- 新增 index.html 页面结…
  └  create mode 100644 index.html
     create mode 100644 style.css
    bb9f73b 新功能：创建居中显示的数字时钟页面

• 提交完成 ✅
  bb9f73b 新功能：创建居中显示的数字时钟页面
  已提交 3 个文件：index.html、style.css、app.js。
```
:::

::: tip 用 codex exec 时提交会直接失败
非交互的 `codex exec` 模式没法停下来问你。作者用 `codex exec --sandbox workspace-write '$zh-commit'` 让它提交时（`$zh-commit` 是第 6 章会讲的一个 Skill，作用是写中文提交说明并提交），Codex 回复"无法完成提交：`.git` 目录被沙箱挂载为只读"，并把要执行的命令告诉了作者，让作者自己运行。这是正常的保护，不是故障。
:::

### 退出，以及下次继续

- 退出：输入 `/exit`，或者按 <kbd>Ctrl</kbd> + <kbd>C</kbd>；
- 继续**上一次**的对话：运行 `codex resume --last`；
- 从历史对话列表里**选一个**恢复：运行 `codex resume`，或在 Codex 里输入 `/resume`。

:::::

## 权限设置

在 Codex 里输入 `/permissions`，可以选择 Codex 能做什么：

::: terminal 你会看到（作者实测）
```text
  Update Model Permissions

› 1. Ask for approval (current)  Read and edit workspace files and run commands, with approval
                                 required for internet access or edits outside the workspace
  2. Approve for me              Only ask for actions detected as potentially unsafe
  3. Full Access                 Use with caution: Codex can edit files outside this workspace and
                                 access the internet without approval

  enter select · esc back
```
:::

| 选项 | 含义 |
|---|---|
| **Ask for approval**（默认） | 可以读写项目文件夹里的文件、执行命令；要联网、或者要改项目以外的文件时，先问你 |
| **Approve for me** | 只有被判断为"可能不安全"的操作才问你，其余的由一个自动审核模型代替你判断 |
| **Full Access** | 可以修改项目以外的文件、随意联网，**全程不问你** |

::: tip 新手建议
保持默认的 **Ask for approval** 即可：项目内的改动交给它，有 Git 兜底；越界的操作由你把关。

**不要**使用 Full Access，也不要使用带 `dangerously` 字样的启动参数，除非你完全清楚后果。
:::

:::: details 背后的原理：沙箱 + 审批
这三个选项，其实是两项设置的组合：

- **沙箱**（技术上允许它碰什么）：`read-only`（只读）、`workspace-write`（可以写项目文件夹）、`danger-full-access`（不限制）；
- **审批**（什么时候问你）：`on-request`（需要越界时问你）、`never`（从不问，越界的操作直接失败）。

默认的 Ask for approval 就是 `workspace-write` + `on-request`。启动时也可以用参数单独指定沙箱，比如只让它看代码、回答问题：

```bash
codex --sandbox read-only
```
::::

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
| `/daemon` | 管理 Codex 的后台服务（一般用不到，见下文常见问题） |
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

## 常见问题

**启动时报错 `Cannot use the shared background server`**
- 新版 Codex 会在后台启动一个共享服务。作者测试时，后台残留了一个旧的服务进程，就出现了这个错误。按提示加上 `--no-daemon` 参数启动即可：`codex --no-daemon`；
- 或者重启电脑，让残留的进程退出。

**让它提交，它说 `.git` 是只读的**
- 这是沙箱的保护，见上文 [存档](#存档)。交互模式下批准它的请求即可；`codex exec` 模式下自己运行它给出的命令。

**右下角一直显示 ⚠ warnings**
- 按 <kbd>F2</kbd> 查看。常见的几条见 [第 5 章 · 可能看到的几行提示](../05-deepseek/codex#可能看到的几行提示)，不影响使用。

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

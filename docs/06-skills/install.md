---
verified: 2026-09-29
versions: [Claude Code 2.1.284, Codex CLI 0.158.0]
time: 15 分钟
tested: partial
---

# 安装现成的 Skill

<PageMeta />

::: info 验证情况
- ✅ 已实测：把 Skill 文件夹复制到 `~/.claude/skills/` 和 `~/.agents/skills/` 后，两个工具都能识别，并能在对话中自动使用（接 DeepSeek）
- ⚠️ 待实测：插件市场和 `$skill-installer` 的在线安装流程（依赖 GitHub 访问和模型调用）
:::

## 去哪里找 Skill

| 来源 | 说明 |
|---|---|
| [anthropics/skills](https://github.com/anthropics/skills) | Anthropic 官方的示例 Skill 仓库，质量有保障 |
| [openai/skills](https://github.com/openai/skills) | OpenAI 官方为 Codex 整理的 Skill 仓库 |
| 本教程的 [`skills/`](https://github.com/doraemonblogs/coding-agent-zero-to-one/tree/HEAD/skills) 目录 | 本教程配套的中文示例 Skill，下一节会详细讲解 |
| 社区分享 | GitHub 上搜索 `SKILL.md` 或 `agent skills`，能找到大量社区作品，质量参差不齐 |

### 推荐给新手的官方 Skill

以下来自 [anthropics/skills](https://github.com/anthropics/skills)，采用 Apache 2.0 开源许可：

| Skill | 作用 | 适合谁 |
|---|---|---|
| `frontend-design` | 做网页时给出更有设计感的配色、字体和布局，避免千篇一律的"AI 风格" | 想让自己做的网页更好看 |
| `skill-creator` | 帮你创建和改进 Skill | 想自己写 Skill |
| `theme-factory` | 给文档、幻灯片、网页套用统一的主题风格 | 经常做展示材料 |
| `mcp-builder` | 指导编写 MCP 服务 | 有一定基础后进阶使用 |

::: tip 文档类 Skill 的许可
同一仓库里的 `docx`、`pdf`、`pptx`、`xlsx`（处理 Office 文档和 PDF）并不是开源许可，使用前请阅读各自的 `LICENSE.txt`。它们还需要安装 Python 和一些依赖库，对新手来说门槛较高。
:::

## 方法一：让 Agent 帮你装（最省事）

Agent 本身就会下载文件、创建文件夹，所以最简单的方法是**直接告诉它**：

::: code-group
```text [对 Claude Code 说]
帮我安装一个 Skill：从 https://github.com/anthropics/skills 下载
skills/frontend-design 这个文件夹，放到 ~/.claude/skills/frontend-design。
下载完后列出这个文件夹里的文件给我确认。
```

```text [对 Codex 说]
帮我安装一个 Skill：从 https://github.com/anthropics/skills 下载
skills/frontend-design 这个文件夹，放到 ~/.agents/skills/frontend-design。
下载完后列出这个文件夹里的文件给我确认。
```
:::

它通常会用 `git clone` 下载整个仓库，再把需要的文件夹复制过去。整个过程中，它执行的每条命令你都能看到。

::: warning 需要能访问 GitHub
下载需要访问 GitHub。国内网络有时访问 GitHub 很慢或失败，可以多试几次，或者参考 [第 2 章](../02-network/) 配置终端代理。

Codex 在默认的沙箱里**不能联网**，下载时会先请求你批准，这是正常的。
:::

## 方法二：手动安装（最通用）

手动安装就是**把 Skill 文件夹复制到指定位置**，不依赖任何在线服务。

::::: steps

### 下载 Skill

以 `frontend-design` 为例。打开 https://github.com/anthropics/skills ，点击绿色的「Code」按钮 →「Download ZIP」，下载整个仓库的压缩包，然后解压。

解压后，`skills/frontend-design` 这个文件夹就是我们要的 Skill。

::: tip 会用 Git 的话
```bash
git clone --depth 1 https://github.com/anthropics/skills.git
```
`--depth 1` 表示只下载最新版本，速度更快。
:::

### 复制到 Skill 目录

在**解压出来的仓库文件夹**里打开终端（参考 [在文件夹里直接打开终端](../01-environment/terminal#在文件夹里直接打开终端)），执行：

::: code-group
```powershell [Windows · Claude Code]
New-Item -ItemType Directory -Force "$HOME\.claude\skills" | Out-Null
Copy-Item -Recurse "skills\frontend-design" "$HOME\.claude\skills\"
```

```powershell [Windows · Codex]
New-Item -ItemType Directory -Force "$HOME\.agents\skills" | Out-Null
Copy-Item -Recurse "skills\frontend-design" "$HOME\.agents\skills\"
```

```bash [macOS / Linux · Claude Code]
mkdir -p ~/.claude/skills
cp -r skills/frontend-design ~/.claude/skills/
```

```bash [macOS / Linux · Codex]
mkdir -p ~/.agents/skills
cp -r skills/frontend-design ~/.agents/skills/
```
:::

两个工具都用的话，两条命令都执行一遍。

### 确认目录结构

复制完成后，结构应该是这样的（以 Claude Code 为例）：

```text
~/.claude/skills/
└── frontend-design/
    ├── SKILL.md
    └── LICENSE.txt
```

::: warning 常见错误：多套了一层文件夹
`SKILL.md` 必须**直接**放在 Skill 文件夹里。如果变成了 `~/.claude/skills/frontend-design/frontend-design/SKILL.md`，工具就找不到它。
:::

### 在工具里确认

启动 Claude Code 或 Codex，输入：

```text
/skills
```

::: terminal Claude Code 中你会看到（示意）
```text
 Skills
 3 skills · enter/space to cycle, / to search, t to sort, Esc to close

 ❯ ✔ beginner-web      user · ~30 tok
   ✔ frontend-design   user · ~60 tok
   ✔ zh-commit         user · ~30 tok
```
:::

列表里出现了刚装的 Skill 就成功了。`user` 表示它来自你的用户目录，`~60 tok` 是它的描述占用的 token 数。

在 Codex 里输入 `/skills`，会先让你选择操作：

::: terminal Codex 中你会看到（作者实测）
```text
  Skills
  Choose an action

› 1. List skills            Tip: press $ to open this list directly
  2. Enable/Disable Skills  Enable or disable skills
```
:::

选 `1` 查看已安装的 Skill 列表。就像提示说的，直接在输入框里按 `$` 也能打开这个列表。

::: tip 装了新 Skill，不想重启？
Claude Code 里输入 `/reload-skills`，可以在不重启的情况下加载新增或修改过的 Skill。
:::

:::::

## 方法三：Claude Code 插件市场

Claude Code 支持通过**插件市场**安装打包好的 Skill。Anthropic 的官方插件市场（`claude-plugins-official`）会在你第一次启动 Claude Code 时自动添加。

::: code-group
```text [浏览官方插件]
/plugin
```

```text [添加 anthropics/skills 市场]
/plugin marketplace add anthropics/skills
```

```text [安装示例 Skill 合集]
/plugin install example-skills@anthropic-agent-skills
```
:::

- 输入 `/plugin` 会打开插件面板，在 **Discover** 标签页里可以搜索、查看和安装插件；
- 安装时会让你选择范围：**只给自己用**（所有项目生效）、**给这个项目的所有协作者用**、或**只在这个项目里给自己用**；
- 通过插件安装的 Skill，调用名字会带上插件名前缀，例如 `/example-skills:frontend-design`。

::: warning 国内网络可能用不了
插件市场托管在 GitHub 上，国内网络可能无法添加市场或下载插件。遇到这种情况，用上面的**方法二**手动安装即可，效果是一样的。
:::

## 方法四：Codex 的 skill-installer

Codex 自带一个叫 `skill-installer` 的 Skill，专门用来安装其他 Skill。在 Codex 里输入：

::: code-group
```text [查看可以安装的 Skill]
$skill-installer 列出可以安装的 skill
```

```text [安装指定 Skill]
$skill-installer 安装 https://github.com/anthropics/skills/tree/main/skills/frontend-design
```
:::

它默认从 [openai/skills](https://github.com/openai/skills) 的精选列表中查找，也支持从任意 GitHub 地址安装。同样需要访问 GitHub，并且会请求联网权限。

## 使用已安装的 Skill

装好之后，有两种用法：

**1. 让 Agent 自己判断**：正常提需求就行，比如"帮我把这个页面重新设计得更好看"。Agent 看到任务和 `frontend-design` 的描述匹配，会自动使用它。

**2. 点名使用**：

::: code-group
```text [Claude Code]
/frontend-design 把 index.html 的时钟页面重新设计一下
```

```text [Codex]
$frontend-design 把 index.html 的时钟页面重新设计一下
```
:::

想确认它有没有用上某个 Skill，可以直接问："你刚才用了哪些 Skill？"

## 卸载

**删除对应的 Skill 文件夹**即可。例如删除 `~/.claude/skills/frontend-design`。通过插件安装的，在 `/plugin` 面板的 **Installed** 标签页里卸载。

## 安全须知

::: danger 只安装你信任的 Skill
Skill 不只是文字说明，它还可以：
- 附带**脚本**，Agent 会按说明运行它们；
- 在 Claude Code 里通过 `allowed-tools` 字段**预先批准**某些操作，运行时不再问你。

一个恶意的 Skill 可能诱导 Agent 删除文件、上传你的代码或 API Key。所以：
1. 优先使用官方仓库和知名作者的 Skill；
2. 安装前**打开 `SKILL.md` 读一遍**，看看它让 Agent 做什么；
3. 有 `scripts/` 文件夹的，大致看一下脚本内容；
4. 看不懂或觉得可疑的，不要装。
:::

下一步：[编写自己的 Skill](./create)

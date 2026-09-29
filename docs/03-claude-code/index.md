---
banner: /images/banners/ch3.webp
verified: 2026-09-29
versions: [Claude Code 2.1.284, npm 10 / 11 / 12]
time: 10 分钟
tested: partial
---

# 安装 Claude Code

<PageMeta />

::: info 验证情况
- ✅ 已实测：npm 10、11、12 三个版本下用本页命令安装，`claude --version` 均正常（Linux）
- ⚠️ 待实测：Windows、macOS 真机安装
:::

## 开始之前

请确认已经完成 [第 1 章](../01-environment/) 的自检清单，特别是：
- `node -v` 显示 **v22 或更高**；
- `npm config get registry` 显示 `https://registry.npmmirror.com`；
- （Windows）已经执行过 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`。

## 安装

::::: steps

### 执行安装命令

在终端中执行（整行复制）：

```bash
npm install -g @anthropic-ai/claude-code --allow-scripts=@anthropic-ai/claude-code
```

这条命令的各部分：

| 部分 | 含义 |
|---|---|
| `npm install` | 安装软件包 |
| `-g` | 全局安装（global），装好之后在任何文件夹都能使用 `claude` 命令 |
| `@anthropic-ai/claude-code` | Claude Code 在 npm 上的包名 |
| `--allow-scripts=...` | 允许这个包在安装时运行它自带的安装脚本（原因见下方提示） |

等待几十秒到几分钟：

::: terminal 你会看到
```text
added 2 packages in 15s
```
:::

::: warning 为什么要加 --allow-scripts？
Claude Code 安装时需要运行一个脚本，把对应你系统的程序文件放到位。最新的 **npm 12 默认会拦截所有安装脚本**，如果不加这个参数，安装看起来成功了，但运行 `claude` 时会报错：

```text
Error: claude native binary not installed.
```

作者实测：加上这个参数后，npm 10、11、12 都能正常安装。旧版本 npm 会忽略这个参数，不影响使用。
:::

### 验证安装

**新开一个终端窗口**，输入：

```bash
claude --version
```

::: terminal 你会看到
```text
2.1.284 (Claude Code)
```
:::

### 运行诊断（可选）

```bash
claude doctor
```

它会检查安装是否健康、配置文件有没有语法错误，最后一行显示 `No installation issues found.` 就说明一切正常。

:::::

::: warning 如果提示找不到 claude 命令
- **先关掉所有终端窗口再重新打开**；
- Windows 报"禁止运行脚本"：回到 [允许 PowerShell 运行脚本](../01-environment/nodejs#windows-专属-允许-powershell-运行脚本)；
- 用 `where.exe claude`（Windows）或 `which claude`（macOS）看看系统能不能找到它；
- 其他情况见 [常见问题](../faq/#命令找不到)。
:::

::: tip npm 包里装的是什么
npm 包会根据你的系统，自动下载对应的**原生程序**（例如 Windows 版、macOS Apple 芯片版等），和官方安装脚本装的是同一个程序。安装完成后运行 `claude` 并不依赖 Node.js。
:::

## Windows 用户：建议安装 Git

Claude Code 在 Windows 上执行命令时，如果检测到已安装 Git，会使用 Git 自带的 **Git Bash**；没有安装的话会改用 PowerShell。两种都能用，但 Agent 对 Bash 命令更熟悉，所以**建议安装 Git**（见 [安装 Git](../01-environment/git)）。

## 下一步：接入模型（重要）

装好的 Claude Code 还不能直接用，它需要连接一个大模型。你有两个选择：

| 方式 | 适合谁 | 怎么做 |
|---|---|---|
| **DeepSeek**（本教程主线） | 国内用户、想低成本学习 | 看 [Claude Code 接入 DeepSeek](../05-deepseek/claude-code)，按步骤配置 |
| 官方账号 | 所在地区支持 Anthropic 服务、有 Claude Pro/Max 订阅或 Console 账号 | 在项目文件夹里运行 `claude`，按提示在浏览器中登录 |

::: warning 用 DeepSeek 的话，先别急着运行 claude
如果不做任何配置就直接运行 `claude`，它会要求你登录 Anthropic 账号。打算用 DeepSeek 的读者，请**先完成第 5 章的配置**再启动。

如果已经看到了登录方式选择界面，按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 退出即可，不影响后续配置。
:::

模型接入完成后，回来看 [第一次上手](./basics)。

## 其他安装方式（了解即可）

下面这些是官方提供的其他安装方式，需要从 Anthropic 的服务器下载，**国内网络可能下载失败**：

::: code-group
```bash [macOS / Linux 官方脚本]
curl -fsSL https://claude.ai/install.sh | bash
```

```powershell [Windows 官方脚本]
irm https://claude.ai/install.ps1 | iex
```

```powershell [Windows winget]
winget install Anthropic.ClaudeCode
```

```bash [macOS Homebrew]
brew install --cask claude-code
```
:::

::: danger 不要混用多种安装方式
同时用多种方式安装，会导致电脑上有好几个 `claude`，更新和排错都会很混乱。**选一种就好**，本教程用的是 npm。
:::

## 更新与卸载

::: code-group
```bash [更新]
npm install -g @anthropic-ai/claude-code@latest --allow-scripts=@anthropic-ai/claude-code
```

```bash [卸载]
npm uninstall -g @anthropic-ai/claude-code
```
:::

::: tip 不要用 npm update -g
官方文档特别提醒：`npm update -g` 可能不会更新到最新版本，请用上面的 `npm install -g ...@latest`。
:::

Claude Code 也会在后台自动检查更新。如果某次更新后运行 `claude` 出现 `native binary not installed` 报错，重新执行一遍上面的更新命令即可。

### 配置文件在哪里

卸载程序**不会**删除你的配置文件。Claude Code 的配置保存在：

| 位置 | 内容 |
|---|---|
| `~/.claude/` 文件夹 | 用户设置 `settings.json`、Skill、历史对话等 |
| `~/.claude.json` 文件 | 界面状态、信任过的文件夹列表等 |
| 项目里的 `.claude/` 文件夹 | 只对这个项目生效的设置和 Skill |
| 项目里的 `CLAUDE.md` | 给 Claude 的项目说明（第一次上手里会讲） |

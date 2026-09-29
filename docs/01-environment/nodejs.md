# 安装 Node.js 与 npm 镜像

::: info 版本信息
最后验证：2026-09-29 · Node.js 24 LTS（v24.21.0）· npm 包 `@anthropic-ai/claude-code` 2.1.284 · `@openai/codex` 0.158.0
:::

## 为什么要装 Node.js

**Node.js** 是一个运行 JavaScript 程序的环境。安装 Node.js 时会自带 **npm**，它是一个**软件包管理器**，可以理解成程序员用的"应用商店"。

Claude Code 和 Codex 都发布在 npm 上，一行命令就能安装：

```bash
npm install -g @anthropic-ai/claude-code
npm install -g @openai/codex
```

::: tip 为什么不用官方的一键安装脚本？
两个工具都有官方安装脚本，但脚本要从 `claude.ai`、`chatgpt.com` 等海外地址下载，国内网络经常下载失败。**npm + 国内镜像**是目前在国内最稳定、不需要代理的安装方式。npm 装的是和官方脚本完全相同的程序。
:::

## 选择版本：LTS

Node.js 的版本分两种：
- **LTS**（长期支持版）：稳定，推荐使用；
- **Current**（最新版）：功能最新，但变动较多。

**请安装 LTS 版本。** 截至本文验证时，LTS 是 **Node.js 24**。Claude Code 要求 Node.js **22 或更高**。

## 安装

::: code-group
```text [Windows（安装包，推荐）]
1. 打开 https://nodejs.org/zh-cn/download
   选择 LTS 版本，下载 Windows 安装程序（.msi 文件）
   官网下载太慢的话，可以从国内镜像下载同名文件：
   https://registry.npmmirror.com/binary.html?path=node/
   （进入 v24 开头的最新文件夹，下载 node-v24.x.x-x64.msi）
2. 双击运行，一路点「Next」保持默认选项即可
   看到「Automatically install the necessary tools」的勾选框时，可以不勾选
```

```powershell [Windows（winget）]
winget install OpenJS.NodeJS.LTS
```

```text [macOS（安装包）]
1. 打开 https://nodejs.org/zh-cn/download
   选择 LTS 版本，下载 macOS 安装程序（.pkg 文件）
   官网下载太慢的话，可以从国内镜像下载同名文件：
   https://registry.npmmirror.com/binary.html?path=node/
   （进入 v24 开头的最新文件夹，下载 node-v24.x.x.pkg）
2. 双击运行，按提示完成安装
```

```bash [Linux]
# 各发行版方式不同，推荐按官网说明操作：
# https://nodejs.org/zh-cn/download
# 注意：Ubuntu/Debian 仓库里自带的 nodejs 版本通常太旧，不要直接 apt install nodejs
```
:::

::: warning 待实测
Windows 和 macOS 的安装界面作者没有在真实机器上逐步验证。安装程序的选项措辞可能随版本变化，以实际界面为准，默认选项一般就可以。
:::

## 验证安装

**关掉终端，重新打开一个**，输入：

```bash
node -v
npm -v
```

`node -v` 输出 `v24.x.x`（至少 `v22`）、`npm -v` 输出一个版本号，就说明安装成功。

## 配置 npm 国内镜像

npm 默认从海外服务器下载软件包，国内经常很慢甚至失败。把下载源换成国内镜像 **npmmirror**：

```bash
npm config set registry https://registry.npmmirror.com
```

验证：

```bash
npm config get registry
```

输出 `https://registry.npmmirror.com` 就对了。

::: tip 以后想换回官方源
```bash
npm config set registry https://registry.npmjs.org
```
:::

## Windows 专属：允许 PowerShell 运行脚本

在 Windows 上，用 npm 全局安装的命令（比如 `claude`、`codex`）实际是一个 PowerShell 脚本。Windows 默认**禁止运行脚本**，你可能会看到这样的报错：

```
无法加载文件 C:\Users\xiaoming\AppData\Roaming\npm\claude.ps1，因为在此系统上禁止运行脚本。
```

提前解决它：在 PowerShell 中执行下面的命令，出现提示时输入 `Y` 并回车：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

这条命令只对当前用户生效，**允许运行本地脚本**，但从网上下载的脚本仍然需要签名，是官方推荐的常用设置。

## macOS / Linux 专属：避免权限错误

在 macOS 或 Linux 上用 `npm install -g` 全局安装软件时，可能会遇到 `EACCES: permission denied`（权限不足）的错误。

::: danger 不要用 sudo 解决
网上常见的做法是在命令前加 `sudo`，这会带来权限混乱和安全风险，Claude Code 官方文档也明确不建议这样做。
:::

正确的做法是**让 npm 把全局软件装到你自己的用户目录里**。在终端依次执行：

```bash
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

::: tip 用的是 bash 而不是 zsh？
macOS 默认用 zsh，上面的命令写的是 `~/.zshrc`。如果你的终端提示符以 `$` 结尾（通常是 Linux 或旧版 macOS），把两处 `~/.zshrc` 改成 `~/.bashrc`。
:::

## 小结

你现在应该已经：
- ✅ 安装了 Node.js LTS，`node -v` 显示 v22 或更高
- ✅ 把 npm 下载源切换到了 npmmirror
- ✅ （Windows）允许了 PowerShell 运行脚本
- ✅ （macOS / Linux）把 npm 全局目录设到了用户目录

下一步：[安装 VS Code](./vscode)

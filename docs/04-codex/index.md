# 安装 Codex CLI

::: info 版本信息
最后验证：2026-09-29 · Codex CLI 0.158.0 · 已在 Linux 上实测 npm 安装
:::

## 开始之前

请确认已经完成 [第 1 章](../01-environment/) 的自检清单，特别是：
- `node -v` 能输出版本号；
- `npm config get registry` 显示 `https://registry.npmmirror.com`；
- （Windows）已经执行过 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`。

## 安装

在终端中执行：

```bash
npm install -g @openai/codex
```

和 Claude Code 一样，npm 会根据你的系统自动下载对应的原生程序。

## 验证

**新开一个终端窗口**，输入：

```bash
codex --version
```

看到类似 `codex-cli 0.158.0` 的输出就说明安装成功。

Codex 也自带诊断命令，可以检查安装、配置和网络连通性：

```bash
codex doctor
```

::: warning 如果提示找不到 codex 命令
- **先关掉所有终端窗口再重新打开**；
- Windows 报"禁止运行脚本"：回到 [允许 PowerShell 运行脚本](../01-environment/nodejs#windows-专属-允许-powershell-运行脚本)；
- 其他情况见 [常见问题](../faq/#命令找不到)。
:::

::: warning 待实测
Codex 在 Windows 原生环境（非 WSL）下的安装和运行，作者没有在真实机器上验证。
:::

## 下一步：接入模型（重要）

和 Claude Code 一样，Codex 需要连接一个大模型才能工作：

| 方式 | 适合谁 | 怎么做 |
|---|---|---|
| **DeepSeek**（本教程主线） | 国内用户、想低成本学习 | 看 [Codex 接入 DeepSeek](../05-deepseek/codex)，按步骤配置 |
| ChatGPT 账号 | 所在地区支持 OpenAI 服务、有 ChatGPT Plus/Pro 等订阅 | 运行 `codex`，选择 **Sign in with ChatGPT**，在浏览器中登录 |
| OpenAI API Key | 有 OpenAI API 账号 | 运行 `codex login --with-api-key`，按提示输入 Key |

::: warning 用 DeepSeek 的话，先别急着运行 codex
不做任何配置就运行 `codex`，它会要求你登录 OpenAI 账号。打算用 DeepSeek 的读者，请**先完成第 5 章的配置**再启动。如果已经看到了登录界面，按 `Ctrl + C` 退出即可。
:::

模型接入完成后，回来看 [第一次上手](./basics)。

## 其他安装方式（了解即可）

下面是官方提供的其他安装方式，需要从海外服务器下载，**国内网络可能下载失败**：

::: code-group
```bash [macOS / Linux 官方脚本]
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

```powershell [Windows 官方脚本]
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

```bash [macOS Homebrew]
brew install --cask codex
```
:::

::: danger 不要混用多种安装方式
选一种就好，本教程用的是 npm。
:::

## 更新与卸载

::: code-group
```bash [更新]
npm install -g @openai/codex@latest
```

```bash [卸载]
npm uninstall -g @openai/codex
```
:::

Codex 的配置保存在用户主目录下的 `.codex` 文件夹里（Windows 是 `C:\Users\你的用户名\.codex`），卸载程序不会删除它。

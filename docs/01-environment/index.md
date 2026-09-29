---
banner: /images/banners/ch1.webp
verified: 2026-09-29
versions: [Node.js 24 LTS, Git 2.x]
time: 40 分钟
---

# 第 1 章 · 基础环境

<PageMeta />

Coding Agent 是在**终端**里运行的程序。它干活时要用到 **Git**（管理代码版本）；安装它要用到 **Node.js** 自带的 **npm**（软件包管理器）。所以在安装 Agent 之前，先把这些基础工具准备好。

## 本章要装什么

| 工具 | 用来做什么 | 必须吗 | 预计用时 |
|---|---|---|---|
| 终端 | 输入命令的地方，Agent 就运行在这里 | 系统自带，学会用就行 | 15 分钟 |
| Git | 给代码做"存档"，Agent 改坏了可以一键恢复 | **强烈建议** | 10 分钟 |
| Node.js（含 npm） | 用 npm 安装 Claude Code 和 Codex | 走本教程的安装方式时**必须** | 10 分钟 |
| VS Code | 看代码、查看 Agent 改了什么 | 建议 | 5 分钟 |

大部分时间花在下载上，网速快的话会更快。

## 按顺序完成

::::: steps

### 认识终端

[认识终端](./terminal)：打开终端、输入命令、了解文件路径和"环境变量"。**这一节是后面所有内容的基础，建议认真做一遍练习。**

### 安装 Git

[安装 Git](./git)：安装、做最基本的配置，并学会"存档"和"撤销"。

### 安装 Node.js 并配置镜像

[安装 Node.js 与 npm 镜像](./nodejs)：安装 Node.js，并把 npm 的下载源换成国内镜像。

### 安装 VS Code

[安装 VS Code](./vscode)：安装编辑器、中文语言包，并做几个对新手友好的设置。

:::::

## 完成后的自检清单

全部装好后，**新开一个终端窗口**，逐行输入下面的命令：

```bash
git --version
node -v
npm -v
npm config get registry
```

::: terminal 你会看到（版本号可以比这里的更新）
```text
git version 2.51.0.windows.1
v24.21.0
11.6.2
https://registry.npmmirror.com
```
:::

| 命令 | 期望结果 | 如果不对 |
|---|---|---|
| `git --version` | `git version 2.x.x` | 回到 [安装 Git](./git) |
| `node -v` | `v24.x.x`（至少 `v22`） | 回到 [安装 Node.js](./nodejs) |
| `npm -v` | 一个版本号 | 回到 [安装 Node.js](./nodejs) |
| `npm config get registry` | `https://registry.npmmirror.com` | 回到 [配置 npm 国内镜像](./nodejs#配置-npm-国内镜像) |

::: tip 提示"不是内部或外部命令"或 "command not found"？
这通常说明软件装好了，但终端还不认识它。先**关掉所有终端窗口，重新打开一个**再试，大多数情况就能解决。还不行的话，看 [常见问题](../faq/#命令找不到)。
:::

全部通过？下一步去 [安装 Claude Code](../03-claude-code/) 或 [安装 Codex CLI](../04-codex/)。第 2 章「网络环境」是选读，在国内按本教程的主线走**不需要代理**。

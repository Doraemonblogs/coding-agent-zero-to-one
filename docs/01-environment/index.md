# 第 1 章 · 基础环境

::: info 版本信息
最后验证：2026-09-29 · Node.js 24 LTS · Git 2.x
:::

Coding Agent 是在**终端**里运行的程序。它干活时要用到 Git（管理代码版本）；安装它要用到 Node.js 自带的 npm（软件包管理器）。所以在安装 Agent 之前，先把这些基础工具准备好。

## 本章要装什么

| 工具 | 用来做什么 | 必须吗 |
|---|---|---|
| 终端 | 输入命令的地方，Agent 就运行在这里 | 系统自带，学会用就行 |
| Git | 给代码做"存档"，Agent 改坏了可以一键恢复 | **强烈建议** |
| Node.js（含 npm） | 用 npm 安装 Claude Code 和 Codex | 走本教程的安装方式时**必须** |
| VS Code | 看代码、看 Agent 改了什么 | 建议 |

预计用时：30～60 分钟，主要花在下载上。

## 按顺序完成

1. [认识终端](./terminal)：打开终端、输入命令、了解"环境变量"
2. [安装 Git](./git)：安装并做最基本的配置
3. [安装 Node.js 与 npm 镜像](./nodejs)：安装 Node.js，并把 npm 下载源切换到国内镜像
4. [安装 VS Code](./vscode)：安装编辑器和中文语言包

## 完成后的自检清单

全部装好后，**新开一个终端窗口**，逐行输入下面的命令。每条都能输出版本号，就说明环境准备好了：

```bash
git --version
node -v
npm -v
npm config get registry
```

正确的输出类似这样（版本号可以比这里的更新）：

```
git version 2.51.0
v24.21.0
11.6.2
https://registry.npmmirror.com
```

| 命令 | 期望结果 | 如果不对 |
|---|---|---|
| `git --version` | `git version 2.x.x` | 回到 [安装 Git](./git) |
| `node -v` | `v24.x.x`（至少 `v22`） | 回到 [安装 Node.js](./nodejs) |
| `npm -v` | 一个版本号 | 回到 [安装 Node.js](./nodejs) |
| `npm config get registry` | `https://registry.npmmirror.com` | 回到 [配置 npm 镜像](./nodejs#配置-npm-国内镜像) |

::: tip 提示"不是内部或外部命令"或 "command not found"？
这通常说明软件装好了，但终端还不认识它。先**关掉所有终端窗口，重新打开一个**再试，大多数情况就能解决。还不行的话，看 [常见问题](../faq/#命令找不到)。
:::

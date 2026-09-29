# 安装 VS Code

::: info 版本信息
最后验证：2026-09-29
:::

## 为什么要装编辑器

Coding Agent 在终端里工作，但你需要一个地方**看代码**：看项目里有哪些文件、Agent 改了什么。**VS Code**（Visual Studio Code）是微软出品的免费代码编辑器，也是目前用得最多的编辑器。

VS Code 还有两个好处：
- 内置终端，可以在同一个窗口里看代码、运行 Agent；
- Claude Code 和 Codex 都有 VS Code 插件，以后想用图形界面也可以。

::: tip 已经有习惯的编辑器？
用 Cursor、JetBrains 系列或其他编辑器也完全可以，本教程只用到"打开文件夹"和"内置终端"这两个基本功能。
:::

## 安装

打开官网 https://code.visualstudio.com/ ，点击下载按钮，网站会自动识别你的系统。

::: code-group
```text [Windows]
1. 下载后双击运行安装程序
2. 在「选择附加任务」这一步，建议勾选：
   ☑ 将"通过 Code 打开"操作添加到 Windows 资源管理器文件上下文菜单
   ☑ 将"通过 Code 打开"操作添加到 Windows 资源管理器目录上下文菜单
   ☑ 添加到 PATH（默认已勾选，不要取消）
3. 完成安装
```

```text [macOS]
1. 下载后解压，把 Visual Studio Code 拖进「应用程序」文件夹
2. 打开 VS Code，按 Command + Shift + P，输入 shell command，
   选择「Shell Command: Install 'code' command in PATH」
   这样以后在终端里输入 code 就能打开 VS Code
```
:::

::: warning 待实测
安装界面的选项措辞可能随版本变化，以实际界面为准。
:::

## 安装中文语言包

1. 打开 VS Code，点击左侧边栏的**扩展**图标（四个小方块），或按 `Ctrl + Shift + X`（macOS：`Command + Shift + X`）
2. 搜索 `Chinese`，找到 **Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code**，点击「Install」
3. 右下角提示重启时，点击重启

## 两个最常用的操作

### 打开一个文件夹

菜单「文件」→「打开文件夹」，选择你的项目文件夹（比如之前创建的 `ai-playground`）。

也可以在终端里进入项目文件夹后，输入：

```bash
code .
```

`.` 代表"当前文件夹"。

### 打开内置终端

菜单「终端」→「新建终端」，或按快捷键 `` Ctrl + ` ``（反引号，在键盘左上角 Esc 下面）。

内置终端**自动位于当前打开的文件夹**，不需要再 `cd`，很适合直接启动 Agent。

::: tip Windows 用户确认终端类型
VS Code 内置终端右上角的 `+` 旁边有个下拉箭头，可以选择终端类型。请确保用的是 **PowerShell**。
:::

## 小结

到这里，第 1 章的基础环境就准备好了。回到 [本章概览](./#完成后的自检清单) 跑一遍自检清单，确认都没问题。

下一步：
- 如果你在国内，**不需要代理**就能完成本教程的主线，可以跳过第 2 章，直接去 [安装 Claude Code](../03-claude-code/) 或 [安装 Codex CLI](../04-codex/)。
- 如果你想了解什么时候需要代理、怎么让终端走代理，看 [第 2 章 · 网络环境](../02-network/)。

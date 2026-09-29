---
verified: 2026-09-29
versions: [VS Code]
time: 10 分钟
tested: none
---

# 安装 VS Code

<PageMeta />

## 为什么要装编辑器

Coding Agent 在终端里工作，但你需要一个地方**看代码**：项目里有哪些文件、Agent 改了哪些地方。**VS Code**（Visual Studio Code）是微软出品的免费代码编辑器，也是目前用得最多的编辑器。

VS Code 对使用 Agent 特别有帮助：

- **内置终端**：在同一个窗口里看代码、运行 Agent；
- **源代码管理面板**：用红绿颜色直观地显示 Agent 改了什么（背后就是 Git）；
- **Agent 插件**：Claude Code 和 Codex 都有 VS Code 插件，以后想用图形界面也可以。

::: tip 已经有习惯的编辑器？
用 Cursor、JetBrains 系列或其他编辑器也完全可以，本教程只用到"打开文件夹""内置终端""查看改动"这几个基本功能。
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

```powershell [Windows（winget）]
winget install Microsoft.VisualStudioCode
```
:::

## 安装中文语言包

::::: steps

### 打开扩展面板

点击左侧边栏的**扩展**图标（四个小方块），或按 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd>（macOS：<kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd>）。

### 搜索并安装

搜索 `Chinese`，找到 **Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code**，点击「Install」。

### 重启

右下角提示重启时，点击重启。之后界面就变成中文了。

:::::

## 推荐设置

下面几个设置能让你和 Agent 配合得更顺畅。

### 开启自动保存

Agent 会直接修改磁盘上的文件。如果你在 VS Code 里也改了同一个文件但没保存，就会出现冲突。开启自动保存可以避免这种情况：

菜单「文件」→ 勾选「自动保存」。

### Windows：把内置终端设为 PowerShell

按 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>，输入 `选择默认配置文件`（英文界面输入 `Terminal: Select Default Profile`），选择 **PowerShell**。

## 三个最常用的操作

### 打开一个文件夹

菜单「文件」→「打开文件夹」，选择你的项目文件夹（比如之前创建的 `ai-playground`）。

也可以在终端里进入项目文件夹后输入：

```bash
code .
```

`.` 代表"当前文件夹"。

::: tip 第一次打开文件夹时的"信任"提示
VS Code 会询问「是否信任此文件夹中的文件的作者」。自己创建的文件夹选择「是，我信任此作者」。来源不明的项目要谨慎，这和后面 Agent 的"信任文件夹"是同一个道理。
:::

### 打开内置终端

菜单「终端」→「新建终端」，或按快捷键 <kbd>Ctrl</kbd> + <kbd>`</kbd>（反引号，在键盘左上角 <kbd>Esc</kbd> 下面）。

内置终端**自动位于当前打开的文件夹**，不需要再 `cd`，很适合直接启动 Agent。

### 查看改动（源代码管理）

点击左侧边栏的**源代码管理**图标（像一个分叉的树枝），或按 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd>。

- 面板里会列出所有**被修改过的文件**：`M` 表示修改、`U` 表示新文件、`D` 表示删除；
- 点击某个文件，会并排显示**修改前**和**修改后**的内容，删掉的部分标红、新增的部分标绿；
- 上方的输入框可以写存档说明，点「提交」就相当于 `git commit`。

::: tip 这是审查 Agent 工作的最佳方式
Agent 改完代码后，打开源代码管理面板逐个文件看一遍，比在终端里看 `git diff` 直观得多。**养成"先看改动，再存档"的习惯。**
:::

::: warning 待实测
VS Code 的菜单名称和安装选项作者没有在真实机器上逐一截图验证，可能随版本略有变化，以实际界面为准。
:::

## 小结

到这里，第 1 章的基础环境就准备好了。回到 [本章概览](./#完成后的自检清单) 跑一遍自检清单，确认都没问题。

下一步：
- 在国内按本教程的主线走**不需要代理**，可以跳过第 2 章，直接去 [安装 Claude Code](../03-claude-code/) 或 [安装 Codex CLI](../04-codex/)。
- 想了解什么时候需要代理、怎么让终端走代理，看 [第 2 章 · 网络环境](../02-network/)。

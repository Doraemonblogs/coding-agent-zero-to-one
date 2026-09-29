# 认识终端

::: info 版本信息
最后验证：2026-09-29 · Windows 10/11、macOS 13+
:::

## 终端是什么

平时你用鼠标点图标、点菜单来操作电脑，这叫**图形界面**。**终端**是另一种操作方式：你输入一行文字命令，按回车，电脑执行并把结果以文字显示出来。

Claude Code 和 Codex 都运行在终端里。你不需要成为终端高手，但要会下面这些基本操作。

## 打开终端

::: code-group
```text [Windows]
推荐使用「终端」（Windows Terminal），Windows 11 自带：
1. 按键盘上的 Win 键，输入「终端」或「Terminal」
2. 点击「终端」打开

也可以右键点击「开始」按钮，选择「终端」。

Windows 10 如果找不到「终端」，可以在 Microsoft Store 搜索安装
「Windows Terminal」；或者直接搜索「PowerShell」打开，效果一样。
```

```text [macOS]
1. 按 Command + 空格，打开「聚焦搜索」
2. 输入「终端」或「Terminal」，按回车
```
:::

打开后你会看到一个窗口，里面有一行**提示符**，光标在后面闪烁，等你输入命令。

::: code-group
```text [Windows]
PS C:\Users\xiaoming>
```

```text [macOS]
xiaoming@MacBook-Air ~ %
```
:::

### Windows 用户：确认你在 PowerShell 里

Windows 有两种命令行：**PowerShell** 和 **CMD**（命令提示符）。本教程的 Windows 命令**都是给 PowerShell 写的**。

判断方法：提示符**以 `PS` 开头**就是 PowerShell。如果没有 `PS`（例如 `C:\Users\xiaoming>`），说明你打开的是 CMD，请换成 PowerShell。

::: tip Windows Terminal 里切换
Windows Terminal 标题栏的 `+` 旁边有个下拉箭头，点开可以选择「Windows PowerShell」。
:::

## 第一批命令

跟着下面的步骤，在终端里依次输入命令，每输入一条就按一次回车。

### 1. 看看"我在哪"

终端在任何时候都有一个**当前所在的文件夹**（也叫当前目录、工作目录）。

::: code-group
```powershell [Windows]
pwd
```

```bash [macOS / Linux]
pwd
```
:::

刚打开终端时，你一般在自己的**用户主目录**里，例如 Windows 的 `C:\Users\xiaoming`，macOS 的 `/Users/xiaoming`。

### 2. 看看当前文件夹里有什么

```bash
ls
```

`ls` 是 list（列出）的缩写。Windows 的 PowerShell 也认识这个命令。

### 3. 新建一个练习用的文件夹

```bash
mkdir ai-playground
```

`mkdir` 是 make directory（创建文件夹）的缩写。执行后，在文件管理器里打开用户主目录，就能看到这个新文件夹。

### 4. 进入这个文件夹

```bash
cd ai-playground
```

`cd` 是 change directory（切换目录）的缩写。再输入一次 `pwd`，会发现路径最后多了 `ai-playground`。

返回上一级文件夹：

```bash
cd ..
```

::: tip 以后启动 Agent 之前，都要先 cd 到项目文件夹
Claude Code 和 Codex 会把**你启动它时所在的文件夹**当作项目，只在这个范围内工作。所以每次都是先 `cd` 到项目文件夹，再启动 Agent。
:::

### 5. 清屏

::: code-group
```powershell [Windows]
cls
```

```bash [macOS / Linux]
clear
```
:::

## 几个很有用的按键

| 按键 | 作用 |
|---|---|
| `Tab` | 自动补全。输入文件夹名的前几个字母再按 Tab，终端会帮你补全 |
| `↑` / `↓` | 翻出之前输入过的命令，不用重新打 |
| `Ctrl + C` | **中断**正在运行的命令。卡住了就按它 |
| 复制 / 粘贴 | Windows Terminal：选中文字后按 `Ctrl + C` 复制，`Ctrl + V` 粘贴；macOS：`Command + C` / `Command + V` |

::: warning Windows Terminal 里 Ctrl + C 有两种作用
**选中了文字**时按 `Ctrl + C` 是复制，**没选中文字**时按 `Ctrl + C` 是中断当前命令。
:::

## 隐藏文件夹

以 `.` 开头的文件和文件夹（比如后面会遇到的 `.claude`、`.codex`）默认是**隐藏**的，存放各种配置文件。后面修改配置时需要找到它们：

::: code-group
```text [Windows]
文件资源管理器 → 顶部菜单「查看」→「显示」→ 勾选「隐藏的项目」
（Windows 10：「查看」选项卡 → 勾选「隐藏的项目」）
```

```text [macOS]
在「访达」（Finder）里按 Command + Shift + .（句号）
再按一次就重新隐藏
```
:::

## 环境变量是什么

后面配置 DeepSeek 时会用到**环境变量**，这里先了解一下概念。

环境变量是操作系统里的一组**"名字 = 值"**。程序启动时会读取它们来获取配置，比如：

```
DEEPSEEK_API_KEY = sk-abc123...
```

Codex 启动时读取 `DEEPSEEK_API_KEY` 这个变量，就知道用哪个 API Key 去访问 DeepSeek。

环境变量有两种设置方式：

- **临时的**：只在当前终端窗口有效，关掉窗口就没了。适合测试。
- **永久的**：写进系统设置或配置文件，以后每次打开终端都有效。

::: code-group
```powershell [Windows]
# 临时设置（只在当前窗口有效）
$env:MY_NAME = "xiaoming"

# 查看
$env:MY_NAME

# 永久设置（对当前用户生效，设置后需要重新打开终端）
[Environment]::SetEnvironmentVariable("MY_NAME", "xiaoming", "User")
```

```bash [macOS / Linux]
# 临时设置（只在当前窗口有效）
export MY_NAME="xiaoming"

# 查看
echo $MY_NAME

# 永久设置：写入 shell 的配置文件（macOS 默认用 zsh）
echo 'export MY_NAME="xiaoming"' >> ~/.zshrc
source ~/.zshrc
```
:::

::: warning 永久设置之后，要重新打开终端
已经打开的终端窗口不会自动读取新设置的永久环境变量。**关掉终端再重新打开**才会生效。很多"明明设置了却不生效"的问题都是因为这个。
:::

## 小结

你现在应该会：
- ✅ 打开终端，并确认 Windows 下用的是 PowerShell
- ✅ 用 `pwd`、`ls`、`cd`、`mkdir` 在文件夹之间移动
- ✅ 用 `Ctrl + C` 中断命令
- ✅ 知道环境变量是什么，以及临时和永久设置的区别

下一步：[安装 Git](./git)

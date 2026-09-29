---
verified: 2026-09-29
versions: [Windows 10/11, macOS 13+]
time: 15 分钟
tested: partial
---

# 认识终端

<PageMeta />

## 终端是什么

平时你用鼠标点图标、点菜单来操作电脑，这叫**图形界面**。**终端**是另一种操作方式：你输入一行文字命令，按回车，电脑执行并把结果以文字显示出来。

Claude Code 和 Codex 都运行在终端里。你不需要成为终端高手，但要会下面这些基本操作。

::: tip 为什么 Agent 要用终端这种"古老"的方式？
因为终端里的一切都是文字：命令是文字，结果也是文字。AI 最擅长处理文字，所以终端是它操作电脑最自然的方式。
:::

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

建议把终端固定到程序坞：终端打开后，右键点击程序坞里的终端图标
→「选项」→「在程序坞中保留」。
```
:::

打开后你会看到一个窗口，里面有一行**提示符**，光标在后面闪烁，等你输入命令：

::: code-group
```text [Windows]
PS C:\Users\xiaoming>
```

```text [macOS]
xiaoming@MacBook-Air ~ %
```
:::

提示符里通常包含**当前所在的文件夹**。Windows 的 `C:\Users\xiaoming`、macOS 的 `~` 都表示你的**用户主目录**（后面会解释）。

### Windows 用户：确认你在 PowerShell 里

Windows 有两种命令行：**PowerShell** 和 **CMD**（命令提示符）。本教程的 Windows 命令**都是给 PowerShell 写的**。

判断方法：提示符**以 `PS` 开头**就是 PowerShell。如果没有 `PS`（例如 `C:\Users\xiaoming>`），说明你打开的是 CMD，请换成 PowerShell。

::: details 把 Windows Terminal 的默认终端设为 PowerShell
1. 在 Windows Terminal 的标题栏上，点击 `+` 号右边的下拉箭头 `∨`，选择「设置」
2. 在「启动」页面，把「默认配置文件」改成「Windows PowerShell」
3. 点击右下角「保存」

以后每次打开终端都是 PowerShell。
:::

## 输入命令前必读：切换到英文输入法

::: danger 命令里的符号必须是英文半角
中文输入法下打出来的引号 `“ ”`、逗号 `，`、冒号 `：`、空格，和英文的 `" "`、`,`、`:`、空格**看起来很像，但对电脑来说完全不同**，会导致命令报错。

**在终端里输入命令时，请先切换到英文输入法**（Windows 一般按 <kbd>Shift</kbd>，macOS 按 <kbd>Control</kbd> + <kbd>空格</kbd> 或 <kbd>Caps Lock</kbd>）。最稳妥的做法是：**直接复制教程里的命令**。
:::

不过，**和 Agent 对话时可以正常用中文**。只有输入命令时才需要注意。

## 第一批命令

跟着下面的步骤，在终端里依次输入命令，每输入一条就按一次 <kbd>Enter</kbd>（回车）。

::::: steps

### 看看"我在哪"

终端在任何时候都有一个**当前所在的文件夹**（也叫**当前目录**或**工作目录**）。输入：

```bash
pwd
```

`pwd` 是 print working directory（显示当前目录）的缩写。

::: code-group
```text [Windows 你会看到]
Path
----
C:\Users\xiaoming
```

```text [macOS 你会看到]
/Users/xiaoming
```
:::

### 看看当前文件夹里有什么

```bash
ls
```

`ls` 是 list（列出）的缩写，会列出当前文件夹里的文件和子文件夹。Windows 的 PowerShell 也认识这个命令。

### 新建一个练习用的文件夹

```bash
mkdir ai-playground
```

`mkdir` 是 make directory（创建文件夹）的缩写。执行后，在文件管理器里打开用户主目录，就能看到这个新文件夹。

### 进入这个文件夹

```bash
cd ai-playground
```

`cd` 是 change directory（切换目录）的缩写。再输入一次 `pwd`，会发现路径最后多了 `ai-playground`。

### 返回上一级

```bash
cd ..
```

两个点 `..` 代表"上一级文件夹"。

:::::

::: tip 以后启动 Agent 之前，都要先 cd 到项目文件夹
Claude Code 和 Codex 会把**你启动它时所在的文件夹**当作项目，只在这个范围内工作。所以每次都是先 `cd` 到项目文件夹，再启动 Agent。
:::

## 常用命令速查

| 命令 | 作用 | 例子 |
|---|---|---|
| `pwd` | 显示当前在哪个文件夹 | `pwd` |
| `ls` | 列出当前文件夹的内容 | `ls` |
| `cd 文件夹名` | 进入某个文件夹 | `cd ai-playground` |
| `cd ..` | 返回上一级 | `cd ..` |
| `cd ~` | 回到用户主目录 | `cd ~` |
| `mkdir 名字` | 新建文件夹 | `mkdir my-project` |
| `cls`（Windows）/ `clear`（macOS） | 清屏 | `cls` |

## 路径：怎么告诉电脑"在哪里"

**路径**就是文件或文件夹的"地址"。

### 用户主目录

每个用户都有一个自己的主目录，存放桌面、下载、文档等文件夹：

| 系统 | 用户主目录 | 简写 |
|---|---|---|
| Windows | `C:\Users\你的用户名` | `~` 或 `$HOME` |
| macOS | `/Users/你的用户名` | `~` |
| Linux | `/home/你的用户名` | `~` |

后面教程里写 `~/.claude`，意思就是"用户主目录下的 `.claude` 文件夹"。

### 绝对路径和相对路径

- **绝对路径**：从最顶层开始写的完整地址，比如 `C:\Users\xiaoming\ai-playground`。在哪里用都指向同一个位置。
- **相对路径**：从**当前文件夹**出发的地址，比如 `ai-playground`、`..`。当前位置变了，指向的地方也跟着变。

::: tip Windows 的斜杠
Windows 的路径用反斜杠 `\`，macOS 和 Linux 用正斜杠 `/`。在 PowerShell 里两种斜杠一般都能用。
:::

### 在文件夹里直接打开终端

与其在终端里一层层 `cd`，不如直接在文件夹里打开终端：

::: code-group
```text [Windows 11]
在文件资源管理器里打开目标文件夹，
在空白处点右键 →「在终端中打开」
```

```text [macOS]
方法一：在「访达」里右键点击文件夹 →「服务」→「新建位于文件夹位置的终端窗口」
（如果没有这个选项：系统设置 → 键盘 → 键盘快捷键 → 服务 → 文件和文件夹，勾选它）

方法二：先在终端里输入 cd 和一个空格，然后把文件夹从访达拖进终端窗口，
路径会自动填好，按回车即可
```
:::

## 几个很有用的按键

| 按键 | 作用 |
|---|---|
| <kbd>Tab</kbd> | **自动补全**。输入文件夹名的前几个字母再按 Tab，终端会帮你补全。既省事又不会打错 |
| <kbd>↑</kbd> / <kbd>↓</kbd> | 翻出之前输入过的命令，不用重新打 |
| <kbd>Ctrl</kbd> + <kbd>C</kbd> | **中断**正在运行的命令。卡住了就按它 |
| 复制 / 粘贴 | Windows Terminal：选中文字后按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制，<kbd>Ctrl</kbd> + <kbd>V</kbd> 粘贴；macOS：<kbd>Command</kbd> + <kbd>C</kbd> / <kbd>Command</kbd> + <kbd>V</kbd> |

::: warning Windows Terminal 里 Ctrl + C 有两种作用
**选中了文字**时按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 是复制；**没选中文字**时按是中断当前命令。
:::

## 显示隐藏文件和文件扩展名

后面修改配置时，你会频繁接触两类"平时看不到"的东西：

**1. 隐藏文件夹**：以 `.` 开头的文件和文件夹（比如 `.claude`、`.codex`）默认是隐藏的，里面存放各种配置。

**2. 文件扩展名**：文件名最后的 `.json`、`.toml`、`.md` 这部分。Windows 默认会隐藏它。

::: danger Windows 用户务必打开"文件扩展名"显示
如果不显示扩展名，你用记事本保存的 `settings.json` 很可能实际叫 `settings.json.txt`，而你完全看不出来，结果配置怎么改都不生效。
:::

::: code-group
```text [Windows 11]
文件资源管理器 → 顶部「查看」→「显示」→
  勾选「文件扩展名」
  勾选「隐藏的项目」
```

```text [Windows 10]
文件资源管理器 → 顶部「查看」选项卡 →
  勾选「文件扩展名」
  勾选「隐藏的项目」
```

```text [macOS]
隐藏文件：在「访达」里按 Command + Shift + .（句号），再按一次恢复隐藏
扩展名：访达 → 设置 → 高级 → 勾选「显示所有文件扩展名」
```
:::

## 环境变量是什么

后面配置 DeepSeek 时会用到**环境变量**，这里先了解一下概念。

环境变量是操作系统里的一组 **"名字 = 值"**。程序启动时会读取它们来获取配置，比如：

```text
DEEPSEEK_API_KEY = sk-abc123...
```

Codex 启动时读取 `DEEPSEEK_API_KEY` 这个变量，就知道用哪个 API Key 去访问 DeepSeek。

环境变量有两种设置方式：

- **临时的**：只在**当前终端窗口**有效，关掉窗口就没了。适合测试。
- **永久的**：写进系统设置或配置文件，以后每次打开终端都有效。

::: code-group
```powershell [Windows PowerShell]
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

### PATH：一个特殊的环境变量

你输入 `git`、`node`、`claude` 时，终端怎么知道这些程序在哪里？答案是一个叫 **PATH** 的环境变量，它记录了一串"程序可能存放的文件夹"。终端会按顺序在这些文件夹里找你输入的命令。

安装软件时，安装程序通常会自动把软件所在的文件夹加进 PATH。这也是为什么**装完软件要重新打开终端**：旧窗口里的 PATH 还是旧的。

想知道某个命令实际在哪里，可以用：

::: code-group
```powershell [Windows]
where.exe git
```

```bash [macOS / Linux]
which git
```
:::

## 练习：检验一下

不看上面的内容，试着完成下面的任务：

1. 打开终端，确认当前在用户主目录；
2. 进入 `ai-playground` 文件夹；
3. 在里面新建一个 `test` 文件夹，进入它，再用 `pwd` 确认位置；
4. 返回 `ai-playground`；
5. 设置一个临时环境变量 `GREETING`，值为 `hello`，再把它显示出来。

:::: details 参考答案
::: code-group
```powershell [Windows]
cd ~
cd ai-playground
mkdir test
cd test
pwd
cd ..
$env:GREETING = "hello"
$env:GREETING
```

```bash [macOS / Linux]
cd ~
cd ai-playground
mkdir test
cd test
pwd
cd ..
export GREETING="hello"
echo $GREETING
```
:::
::::

## 小结

你现在应该会：
- ✅ 打开终端，并确认 Windows 下用的是 PowerShell
- ✅ 输入命令时切换到英文输入法
- ✅ 用 `pwd`、`ls`、`cd`、`mkdir` 在文件夹之间移动
- ✅ 理解用户主目录 `~` 和绝对路径、相对路径
- ✅ 显示隐藏文件和文件扩展名
- ✅ 知道环境变量和 PATH 是什么，以及临时和永久设置的区别

::: warning 待实测
Windows 和 macOS 的菜单名称（如「在终端中打开」「新建位于文件夹位置的终端窗口」）是根据系统常见界面整理的，作者没有在每个系统版本上逐一截图验证。菜单文字可能随系统版本略有不同。
:::

下一步：[安装 Git](./git)

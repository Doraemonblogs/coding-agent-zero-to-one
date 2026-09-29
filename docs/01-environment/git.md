# 安装 Git

::: info 版本信息
最后验证：2026-09-29 · Git 2.x
:::

## 为什么要装 Git

Git 是一个**版本管理**工具。你可以把它理解成游戏里的**存档**：

- 每完成一步，就存一个档（叫作一次**提交**，commit）；
- 之后不管改成什么样，都可以对比"现在和存档时有什么不同"；
- 改坏了，可以一键回到上一个存档。

用 Coding Agent 时，Git 格外重要。Agent 一次可能修改很多文件，改得不满意时，**有 Git 存档就能一键撤销，没有就只能手动一点点改回去**。

另外，Claude Code 在 Windows 上会借助 Git 自带的 Git Bash 来执行命令，体验更好。

## 安装

::: code-group
```powershell [Windows（推荐 winget）]
# 在 PowerShell 中执行（Windows 10 1809 以上、Windows 11 自带 winget）
winget install --id Git.Git -e --source winget
```

```text [Windows（安装包）]
1. 打开 https://git-scm.com/downloads/win 下载安装包
   官网下载太慢的话，可以从国内镜像下载同名安装包：
   https://registry.npmmirror.com/binary.html?path=git-for-windows/
   （进入最新版本的文件夹，下载文件名以 -64-bit.exe 结尾的那个）
2. 双击运行，一路点「Next」保持默认选项即可
```

```bash [macOS]
# 在终端中执行。如果系统还没装 Git，会弹窗提示安装「命令行开发者工具」，
# 点击「安装」并等待完成即可
git --version
```

```bash [Linux（Ubuntu / Debian）]
sudo apt update && sudo apt install -y git
```
:::

::: warning 待实测
Windows 下 winget 和安装包两种方式、macOS 的弹窗安装流程，作者没有在真实机器上逐步验证。如果你看到的界面和描述不一样，以实际界面为准。
:::

## 验证安装

**关掉终端，重新打开一个**，然后输入：

```bash
git --version
```

看到类似 `git version 2.51.0` 的输出就说明安装成功。

## 首次配置

Git 要求每次提交都记录"是谁提交的"。第一次使用前，设置你的名字和邮箱（**不需要**是真实姓名，也**不需要**注册任何网站）：

```bash
git config --global user.name "你的名字"
git config --global user.email "you@example.com"
```

再把默认分支名设为 `main`（现在的通用做法）：

```bash
git config --global init.defaultBranch main
```

检查配置：

```bash
git config --global --list
```

## 最少必要的 Git 操作

目前只需要学会下面几个命令。在 [上一节](./terminal) 创建的 `ai-playground` 文件夹里练习一遍：

```bash
cd ~/ai-playground
```

::: tip `~` 是什么
`~` 代表你的用户主目录。Windows 的 PowerShell 也认识这个写法。
:::

### 1. 初始化仓库

把当前文件夹变成一个 Git 仓库（只需要做一次）：

```bash
git init
```

### 2. 存档（提交）

先随便创建一个文件：

::: code-group
```powershell [Windows]
"hello" | Out-File -Encoding utf8 hello.txt
```

```bash [macOS / Linux]
echo "hello" > hello.txt
```
:::

然后存档：

```bash
git add -A
git commit -m "第一次存档"
```

- `git add -A`：把所有改动放进"待存档"区；
- `git commit -m "..."`：正式存档，引号里写这次存档的说明。

### 3. 查看状态和改动

```bash
git status      # 看看有哪些文件被改过
git diff        # 看看具体改了哪些内容
git log --oneline   # 看看所有存档记录
```

::: tip git log 翻页
如果 `git log` 的输出很长，会进入翻页模式。按空格翻页，按 `q` 退出。
:::

### 4. 撤销还没存档的改动

把 `hello.txt` 的内容随便改一改，然后执行：

```bash
git restore .
```

所有**没有存档**的修改都会被撤销，文件回到上次存档时的样子。

::: danger git restore 会丢弃修改
`git restore .` 撤销的修改**无法找回**。执行前先用 `git status` 和 `git diff` 确认，这些修改确实不要了。
:::

::: tip 新建的文件不会被撤销
`git restore .` 只能恢复**已经存过档的文件**。存档之后才新建的文件（`git status` 里显示为 `Untracked files`）不受影响，不想要的话需要手动删除。
:::

## 和 Agent 配合的好习惯

> **让 Agent 动手之前，先存一次档。**

```bash
git add -A
git commit -m "交给 Agent 之前的存档"
```

这样 Agent 改完之后：
- 满意，就再存一次档；
- 不满意，就用 `git restore .` 一键回到改之前。

更多 Git 用法会在第 8 章「方法与技巧」里介绍。

下一步：[安装 Node.js 与 npm 镜像](./nodejs)

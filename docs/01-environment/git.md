---
verified: 2026-09-29
versions: [Git 2.x]
time: 15 分钟
tested: partial
---

# 安装 Git

<PageMeta />

## 为什么要装 Git

Git 是一个**版本管理**工具。你可以把它理解成游戏里的**存档**：

- 每完成一步，就存一个档（叫作一次**提交**，commit）；
- 之后不管改成什么样，都可以对比"现在和存档时有什么不同"；
- 改坏了，可以一键回到上一个存档。

用 Coding Agent 时，Git 格外重要。Agent 一次可能修改很多文件，改得不满意时，**有 Git 存档就能一键撤销，没有就只能手动一点点改回去**。

另外，Claude Code 在 Windows 上会借助 Git 自带的 **Git Bash** 来执行命令，体验更好。

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
# 点击「安装」并等待完成即可（需要几分钟）
git --version
```

```bash [Linux（Ubuntu / Debian）]
sudo apt update && sudo apt install -y git
```
:::

::: tip winget 是什么？
winget 是 Windows 自带的"应用商店命令行版"，一行命令就能安装软件。第一次使用时可能会询问是否同意协议，输入 `Y` 回车即可。
:::

## 验证安装

**关掉终端，重新打开一个**，然后输入：

```bash
git --version
```

::: terminal 你会看到
```text
git version 2.51.0.windows.1
```
:::

macOS 上会显示类似 `git version 2.39.5 (Apple Git-154)`，版本号不同没关系。

## 首次配置

Git 要求每次存档都记录"是谁存的"。第一次使用前，设置你的名字和邮箱。这里的名字和邮箱**只是一个标记**，不需要是真实姓名，也不需要注册任何网站：

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

::: terminal 你会看到
```text
user.name=你的名字
user.email=you@example.com
init.defaultbranch=main
```
:::

::: tip 以后要上传到 GitHub？
如果你以后会把代码上传到 GitHub，邮箱可以填 GitHub 账号的邮箱，这样提交记录会和账号关联起来。现在先随便填一个也完全可以，以后随时能改。
:::

::: warning 这一步不要跳过
没配置名字和邮箱，**Agent 帮你提交时也会失败**。作者实测：Claude Code 提交失败后，会停下来问你是用一个"占位身份"还是跳过提交。提前配置好，就不会遇到这个问题。
:::

## 最少必要的 Git 操作

目前只需要学会下面几个操作。在 [上一节](./terminal) 创建的 `ai-playground` 文件夹里练习一遍：

```bash
cd ~/ai-playground
```

::::: steps

### 初始化仓库

把当前文件夹变成一个 Git **仓库**（只需要做一次）：

```bash
git init
```

::: terminal 你会看到
```text
Initialized empty Git repository in C:/Users/xiaoming/ai-playground/.git/
```
:::

Git 会在文件夹里创建一个隐藏的 `.git` 文件夹，所有存档都保存在里面。**不要手动修改或删除它。**

### 创建一个文件

::: code-group
```powershell [Windows]
"hello" | Out-File -Encoding utf8 hello.txt
```

```bash [macOS / Linux]
echo "hello" > hello.txt
```
:::

### 查看状态

```bash
git status
```

::: terminal 你会看到
```text
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        hello.txt

nothing added to commit but untracked files present (use "git add" to track)
```
:::

`Untracked files` 表示"Git 还没开始管理的新文件"。

### 存档（提交）

```bash
git add -A
git commit -m "第一次存档"
```

- `git add -A`：把**所有**改动放进"待存档"区；
- `git commit -m "..."`：正式存档，引号里写这次存档的说明。

::: terminal 你会看到
```text
[main (root-commit) 3f2a1b7] 第一次存档
 1 file changed, 1 insertion(+)
 create mode 100644 hello.txt
```
:::

### 修改后查看差异

用记事本或 VS Code 把 `hello.txt` 的内容改成 `hello world`，保存，然后：

```bash
git diff
```

::: terminal 你会看到
```text
diff --git a/hello.txt b/hello.txt
index ce01362..3b18e51 100644
--- a/hello.txt
+++ b/hello.txt
@@ -1 +1 @@
-hello
+hello world
```
:::

前几行是文件信息，可以先不管。重点看最后两行：以 `-` 开头的是**删掉的**内容，以 `+` 开头的是**新增的**内容（在终端里通常分别显示为红色和绿色）。以后检查 Agent 改了什么，主要就靠它。

::: tip git diff 看不到新文件
`git diff` 只显示**已经存过档的文件**的改动。Agent 新建的文件，要用 `git status` 才能看到（前面带 `??`）。所以检查 Agent 的改动时，先 `git status` 看全貌，再 `git diff` 看细节。
:::

### 撤销还没存档的改动

不想要刚才的修改了？执行：

```bash
git restore .
```

所有**没有存档**的修改都会被撤销，文件回到上次存档时的样子。打开 `hello.txt` 确认一下，内容应该又变回了 `hello`。

### 查看存档记录

```bash
git log --oneline
```

::: terminal 你会看到
```text
3f2a1b7 (HEAD -> main) 第一次存档
```
:::

每一行是一次存档，前面那串字母数字是存档的编号。

:::::

::: danger git restore 会丢弃修改
`git restore .` 撤销的修改**无法找回**。执行前先用 `git status` 和 `git diff` 确认，这些修改确实不要了。
:::

::: tip 新建的文件不会被撤销
`git restore .` 只能恢复**已经存过档的文件**。存档之后才新建的文件（`git status` 里显示为 `Untracked files`）不受影响，不想要的话需要手动删除。
:::

::: tip git log 翻页
如果 `git log` 的输出很长，会进入翻页模式。按空格翻页，按 `q` 退出。
:::

## .gitignore：告诉 Git 哪些文件不要管

有些文件**不应该**被存进 Git，比如：

- 存放 API Key 等密码的文件（如 `.env`）；
- 自动生成的、体积很大的文件夹（如 `node_modules`）。

在项目根目录创建一个名为 `.gitignore` 的文本文件，每行写一个要忽略的文件或文件夹：

```text
# 密钥文件，绝对不能提交
.env

# 依赖包文件夹，可以随时重新下载
node_modules/
```

写进 `.gitignore` 的文件，`git status` 里就不会再显示，`git add -A` 也不会把它们加进去。

::: danger 已经提交过的密钥，删掉文件也没用
Git 会永久保留每一次存档。如果你**已经**把含有 API Key 的文件提交过，即使后来删除了这个文件，旧的存档里依然能看到 Key。正确的做法是：**立即到服务商后台删除这个 Key，重新生成一个新的**。
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

你也可以直接让 Agent 帮你执行这些 Git 命令，比如对它说"帮我把现在的改动提交一下，说明写中文"。

更多 Git 用法（分支、回退到更早的存档等）会在第 8 章 [靠谱的工作流程](../08-tips/workflow) 中介绍。

::: warning 待实测
Windows 下 winget 和安装包两种方式、macOS 的弹窗安装流程，作者没有在真实机器上逐步验证。命令本身和输出格式已在 Linux 上验证。
:::

下一步：[安装 Node.js 与 npm 镜像](./nodejs)

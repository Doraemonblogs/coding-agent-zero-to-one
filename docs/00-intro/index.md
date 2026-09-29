---
verified: 2026-09-29
time: 10 分钟
---

# 什么是 Coding Agent

<PageMeta />

## 一句话解释

**Coding Agent（编程智能体）是一个能在你电脑上"动手干活"的 AI 编程助手。**

你用中文告诉它要做什么，它会自己去读项目里的文件、修改代码、运行命令、看报错、再修改，直到把事情做完。整个过程中，你主要负责三件事：**提需求、审核它的操作、检查结果**。

本教程讲两个最主流的 Coding Agent：

| | Claude Code | Codex CLI |
|---|---|---|
| 出品方 | Anthropic | OpenAI |
| 运行方式 | 终端（命令行），也有 VS Code 插件和桌面版 | 终端（命令行），也有 VS Code 插件和桌面版 |
| 默认模型 | Claude 系列 | GPT 系列 |
| 能否接入 DeepSeek | 能（DeepSeek 提供 Anthropic 兼容接口） | 能（DeepSeek 提供 Responses 兼容接口） |
| 项目说明文件 | `CLAUDE.md` | `AGENTS.md` |

## 它是怎么干活的

Coding Agent 的核心是一个**循环**：它不是一次性把答案吐给你，而是像人一样"做一步、看一眼、再做下一步"。

<figure class="cz-figure">
<svg viewBox="0 0 680 300" role="img" aria-label="Coding Agent 的工作循环：你提出需求后，Agent 按读取文件、修改代码、运行检查、查看结果的顺序循环，做完后向你汇报" style="width:100%;height:auto;font-family:var(--vp-font-family-base)">
  <defs>
    <marker id="loop-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--vp-c-text-3)"/>
    </marker>
    <marker id="loop-arrow-brand" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--vp-c-brand-1)"/>
    </marker>
  </defs>
  <circle cx="340" cy="150" r="112" fill="none" stroke="var(--vp-c-brand-soft)" stroke-width="26"/>
  <g stroke="var(--vp-c-brand-1)" stroke-width="2" fill="none" marker-end="url(#loop-arrow-brand)">
    <path d="M231.8,121 A112,112 0 0 1 275.7,58.3"/>
    <path d="M404.3,58.3 A112,112 0 0 1 448.2,121"/>
    <path d="M448.2,179 A112,112 0 0 1 404.3,241.7"/>
    <path d="M275.7,241.7 A112,112 0 0 1 231.8,179"/>
  </g>
  <g font-size="14" fill="var(--vp-c-text-1)" text-anchor="middle">
    <rect x="10" y="118" width="120" height="64" rx="12" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
    <text x="70" y="146" font-weight="600">你</text>
    <text x="70" y="166" font-size="12" fill="var(--vp-c-text-2)">用中文提需求</text>
    <rect x="530" y="228" width="130" height="60" rx="12" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
    <text x="595" y="254" font-weight="600">完成</text>
    <text x="595" y="274" font-size="12" fill="var(--vp-c-text-2)">向你汇报结果</text>
    <rect x="168" y="128" width="120" height="44" rx="22" fill="var(--vp-c-bg)" stroke="var(--vp-c-brand-1)" stroke-width="1.5"/>
    <text x="228" y="155">① 读取文件</text>
    <rect x="280" y="20" width="120" height="44" rx="22" fill="var(--vp-c-bg)" stroke="var(--vp-c-brand-1)" stroke-width="1.5"/>
    <text x="340" y="47">② 修改代码</text>
    <rect x="392" y="128" width="120" height="44" rx="22" fill="var(--vp-c-bg)" stroke="var(--vp-c-brand-1)" stroke-width="1.5"/>
    <text x="452" y="155">③ 运行检查</text>
    <rect x="280" y="236" width="120" height="44" rx="22" fill="var(--vp-c-bg)" stroke="var(--vp-c-brand-1)" stroke-width="1.5"/>
    <text x="340" y="263">④ 看结果</text>
    <text x="340" y="146" font-size="13" font-weight="700" fill="var(--vp-c-brand-1)">Agent</text>
    <text x="340" y="166" font-size="12" fill="var(--vp-c-text-2)">没做完就再来一轮</text>
    <text x="464" y="248" font-size="12" fill="var(--vp-c-text-2)">做完了</text>
  </g>
  <g stroke="var(--vp-c-text-3)" stroke-width="1.5" fill="none" marker-end="url(#loop-arrow)">
    <path d="M130,150 L166,150"/>
    <path d="M400,258 L528,258"/>
  </g>
</svg>
<figcaption>Agent 的工作循环：读文件 → 改代码 → 运行检查 → 看结果，不满意就再来一轮</figcaption>
</figure>

举个例子。你说"帮我修好这个网页的报错"，它大致会这样做：

::: terminal 一次典型的 Agent 工作过程（示意）
```text
❯ 网页打开后按钮点了没反应，帮我修一下

● 我先看看页面的代码。
  ⎿ Read(index.html)                 ← ① 读取文件
  ⎿ Read(app.js)
● 找到原因了：app.js 第 12 行的按钮 id 写错了，
  页面里是 "submit-btn"，代码里写成了 "submitBtn"。
  ⎿ Edit(app.js)                     ← ② 修改代码
● 我运行一下检查，确认没有其他错误。
  ⎿ Bash(node --check app.js)        ← ③ 运行检查
     (没有输出，说明语法正确)          ← ④ 看结果
● 已修复。刷新页面后按钮应该能正常工作了。
```
:::

注意它的每一步都是**真的在你电脑上执行**：真的读了文件，真的改了代码，真的运行了命令。这就是 Agent 和聊天机器人最大的区别。

## 它和"网页版聊天 AI"有什么区别？

你可能用过 DeepSeek、豆包、Kimi 这类网页版聊天 AI，把代码复制进去，让它帮你改。

| | 网页版聊天 AI | Coding Agent |
|---|---|---|
| 看代码 | 你手动复制粘贴给它 | 它自己打开项目文件去读 |
| 改代码 | 它给你一段代码，你自己复制回去 | 它直接修改文件 |
| 运行和调试 | 你自己运行，再把报错贴给它 | 它自己运行命令、看报错、接着改 |
| 能看到多少 | 你贴给它的那几段 | 整个项目文件夹 |
| 适合做什么 | 问问题、写小片段 | 完成一个完整的任务，比如"加一个登录页面并跑通" |

打个比方：网页版 AI 像一个**远程顾问**，只能隔着屏幕给建议；Coding Agent 像一个**坐在你旁边的程序员**，可以直接上手操作你的电脑。

## 它和 Copilot 代码补全有什么区别？

GitHub Copilot 这类**代码补全**工具，是在你打字时猜你下一行要写什么。主角是你，它只是帮你少敲几个字。

Coding Agent 的主角是它自己：你描述一个目标，它规划步骤并执行。你的角色更像**项目经理 + 代码审核员**。

## 它能做什么、不能做什么

**比较擅长的：**
- 从零搭一个小工具、小网站、小脚本
- 读懂一个陌生项目，给你讲清楚它的结构
- 定位和修复报错
- 写测试、写文档、批量修改代码
- 帮你学编程：让它写，然后问它"为什么这么写"

**需要你把关的：**
- **它会犯错。** 代码能运行不等于逻辑正确，重要的地方要自己检查。
- **它会执行命令。** 删除文件、安装软件这类操作，要看清楚再批准。
- **它不知道你没说的事。** 需求越具体，结果越好。
- **它会花钱。** 每一轮都要调用大模型，按用量计费，任务越大花费越多。

::: tip 零基础能学会吗？
能。本教程默认你没用过终端，每个步骤都会写清楚：在哪里输入什么、正确的结果长什么样、出错了怎么办。你不需要先学会编程，但要愿意跟着步骤动手，遇到报错时不慌。
:::

## 先认识几个词

后面会反复出现这些词，先有个印象，不用死记：

| 词 | 通俗解释 |
|---|---|
| **模型**（大模型） | 真正"思考"的 AI，比如 DeepSeek-V4、Claude、GPT。Claude Code 和 Codex 本身只是"外壳"，负责调用模型、执行操作 |
| **API** | 程序之间互相调用的接口。Agent 通过 API 把你的需求发给模型 |
| **API Key** | 调用 API 用的"密码"，费用从这个 Key 对应的账户里扣。**千万不能泄露** |
| **token** | 模型处理文字的计量单位，可以粗略理解为"字数"。费用按 token 计算 |
| **上下文** | 模型在一次对话中能"看到"的全部内容：你说的话、它读过的文件、执行过的命令结果……上下文越长，费用越高、反应越慢 |
| **提示词**（prompt） | 你对 AI 说的话，也就是你提的需求 |
| **终端** | 输入命令的窗口，Agent 就运行在里面。第 1 章会详细讲 |

## 关于账号和费用：本教程的主线选择

Claude Code 和 Codex 本身是**免费下载**的软件，但它们必须连接一个**大模型**才能工作，而大模型是收费的。连接方式有两种：

1. **官方账号**：Claude Code 用 Anthropic 的 Claude 订阅或 API；Codex 用 ChatGPT 订阅或 OpenAI API。
2. **第三方模型**：把工具连接到其他兼容的模型服务，比如 **DeepSeek**。

::: warning 关于官方服务的地区限制
Anthropic 和 OpenAI 的官方服务**不支持中国大陆等地区**。在不支持的地区通过代理注册或使用官方账号，违反它们的服务条款，账号有被封禁的风险。
:::

所以本教程的**主线**是：

> **Claude Code / Codex（工具本身）+ DeepSeek（国内可以直接访问的模型服务）**

这条路线的好处：

- 安装工具走 npm 国内镜像，**不需要代理**；
- DeepSeek 是国内服务，**直接访问**，充值方便；
- 价格相对便宜，适合学习和日常使用。

如果你所在的地区支持官方服务，也可以用官方账号，第 3、4 章会顺带提到。

## 下一步

看一眼 [学习路线图](./roadmap)，了解整个教程怎么安排、该从哪里开始。

---
verified: 2026-09-29
versions: [Claude Code 2.1.284, Codex CLI 0.158.0]
time: 10 分钟
---

# 上下文与费用

<PageMeta />

## 什么是上下文

**上下文**是模型每一轮能"看到"的全部内容。每次你发一句话，Agent 都会把下面这些**一起**发给模型：

<figure class="cz-figure">
<svg viewBox="0 0 680 150" role="img" aria-label="每一轮发送给模型的上下文由系统提示词、项目说明、Skill 描述、对话历史、读过的文件和命令输出组成，其中后三项会随着对话越来越长" style="width:100%;height:auto;font-family:var(--vp-font-family-base)">
  <g font-size="12.5" text-anchor="middle">
    <rect x="10" y="30" width="80" height="44" fill="var(--vp-c-default-soft)" stroke="var(--vp-c-bg)" stroke-width="2"/>
    <text x="50" y="56" fill="var(--vp-c-text-1)">系统提示词</text>
    <rect x="90" y="30" width="70" height="44" fill="var(--vp-c-default-soft)" stroke="var(--vp-c-bg)" stroke-width="2"/>
    <text x="125" y="56" fill="var(--vp-c-text-1)">项目说明</text>
    <rect x="160" y="30" width="70" height="44" fill="var(--vp-c-default-soft)" stroke="var(--vp-c-bg)" stroke-width="2"/>
    <text x="195" y="56" fill="var(--vp-c-text-1)">Skill 描述</text>
    <rect x="230" y="30" width="160" height="44" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-bg)" stroke-width="2"/>
    <text x="310" y="56" fill="var(--vp-c-text-1)">对话历史</text>
    <rect x="390" y="30" width="160" height="44" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-bg)" stroke-width="2"/>
    <text x="470" y="56" fill="var(--vp-c-text-1)">读过的文件</text>
    <rect x="550" y="30" width="120" height="44" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-bg)" stroke-width="2"/>
    <text x="610" y="56" fill="var(--vp-c-text-1)">命令输出</text>
  </g>
  <g font-size="12" fill="var(--vp-c-text-2)">
    <path d="M10,88 L230,88" stroke="var(--vp-c-text-3)" stroke-width="1.5"/>
    <text x="120" y="108" text-anchor="middle">基本固定</text>
    <path d="M230,88 L670,88" stroke="var(--vp-c-brand-1)" stroke-width="1.5"/>
    <text x="450" y="108" text-anchor="middle" fill="var(--vp-c-brand-1)">随对话不断变长</text>
    <text x="340" y="138" text-anchor="middle">每一轮，这一整条都会发给模型，按 token 计费</text>
  </g>
</svg>
<figcaption>上下文的组成：前面几项基本固定，后面几项会越积越多</figcaption>
</figure>

这带来两个后果：

1. **越聊越贵**：对话越长，每一轮发送的内容越多，花费越高；
2. **越聊越"糊涂"**：上下文里堆满了早先的尝试、无关的文件内容，模型更容易被干扰，做出前后矛盾的事。

DeepSeek V4 支持 100 万 token 的上下文，"装得下"不等于"用得好"。**保持上下文干净**，是既省钱又提高质量的关键。

## 用真实数字感受一下

下面是作者接 DeepSeek 实测时记下的数字：

| 场景 | token 用量 |
|---|---|
| 在 Codex 里只问一句"用一句话介绍你自己" | **9,096** |
| 在 Claude Code 里问"你看到这个项目的说明和 Skill 了吗？" | 输入 16,805，输出 272 |
| [第 7 章](../07-practice/) 阶段 4（按检查清单验收，19 轮） | 输入约 115 万，输出 9,337 |
| 第 7 章全程（15 步、99 轮） | 输入约 547 万，输出约 6.5 万 |

从这张表能看出三件事：

1. **"底座"很重**：哪怕只问一句话，系统提示词、工具说明、项目说明加起来就有上万 token；
2. **输入远多于输出**：Agent 每一轮都要把整个上下文重新发一遍，轮数一多，输入就是输出的几十倍；
3. **轮数决定用量**：阶段 4 来回了 19 轮，一个阶段就用掉了一百多万输入 token。

那为什么第 7 章全程只花了 2～4 元？因为**缓存**。

### 缓存：Agent 省钱的关键

每一轮发送的内容里，前面的大部分（系统提示词、项目说明、之前的对话）和上一轮**一模一样**。DeepSeek 会把这些重复的开头部分缓存起来，再次收到时按"命中缓存"的价格计费，只有原价的几十分之一（价格见 [第 5 章](../05-deepseek/#关于费用)）。

作者第 7 章的实测：输入中 **98.9%** 命中了缓存。估算下来总花费约 2 元（空闲时段），如果没有缓存要 25 元左右。

所以：

- **需求说清楚，减少返工**：缓存再便宜，每多一轮也要把整个上下文再发一遍，轮数越少越省；
- **做完一件事就 `/clear`**：新对话从一个短的上下文重新开始，后面每一轮都便宜；
- **大任务放到空闲时段**：DeepSeek 在北京时间工作日 9:00-12:00、14:00-18:00 以外的时段**半价**。

## 查看上下文用了多少

| 工具 | 命令 | 显示什么 |
|---|---|---|
| Claude Code | `/context` | 用彩色格子显示上下文各部分的占用情况，还会给出优化建议 |
| Claude Code | `/usage` | 本次会话的用量统计 |
| Codex | `/status` | 当前配置和 token 用量 |

## 三个管理上下文的命令

| 命令 | 作用 | 什么时候用 |
|---|---|---|
| `/clear`（Claude Code）<br>`/new`（Codex） | 清空对话，从零开始 | 一件事做完、提交之后；要开始一个不相关的新任务时 |
| `/compact` | 把之前的对话压缩成一份摘要，保留要点、腾出空间 | 任务还没做完，但对话已经很长了 |
| `/resume` | 恢复之前的某个对话 | 想接着之前的话题继续 |

::: tip 养成"做完一件事就 /clear"的习惯
这是最简单也最有效的省钱方法。开新对话后，Agent 会重新读取 `CLAUDE.md` / `AGENTS.md`，需要接着之前的工作时，让它读一下 `PLAN.md` 就行。
:::

::: tip /compact 可以指定重点
`/compact 保留小账本的数据结构和还没解决的删除 bug`：告诉它压缩时重点保留什么。
:::

## 省钱技巧

| 技巧 | 说明 |
|---|---|
| **用 @ 指定文件** | "看看 @app.js 的删除函数"，比"看看整个项目哪里有删除功能"省得多 |
| **别让它读大文件** | 日志、数据文件、`node_modules` 这类大文件，让它只看相关的几行："只看报错日志的最后 50 行" |
| **项目说明保持简短** | `CLAUDE.md` / `AGENTS.md` 每轮都会发送，几十行以内为宜；长内容写成 Skill |
| **简单任务用便宜的模型** | 改个文字、调个颜色，用 flash 模型就够了（Claude Code 用 `/model` 切换，Codex 用 `/model`） |
| **调低思考深度** | 简单任务不需要"深度思考"。Claude Code 用 `/effort high`（或更低），Codex 用 `/model` 选择推理强度 |
| **需求一次说清** | 来回返工十轮，比一开始多写两句需求贵得多 |

## 监控费用

- 在 [DeepSeek 开放平台](https://platform.deepseek.com/) 的「用量信息」页面，可以按天查看消耗；
- 刚开始使用时，做完一个任务就去看一眼，心里会对"一个任务大概花多少钱"有数；
- 给不同工具创建不同的 API Key，可以分别看到各自的消耗。

::: tip 少量充值，就是最好的预算上限
每次只充一小笔，用完再充。即使配置出错或者 Agent 陷入死循环，损失也有上限。
:::

::: warning /usage 显示的金额仅供参考
接入 DeepSeek 时，Claude Code 的 `/usage` 可能按 Claude 的价格估算费用，和实际扣费不一致。**以 DeepSeek 平台的账单为准。**
:::

下一节：[安全须知](./safety)

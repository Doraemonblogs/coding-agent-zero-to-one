---
verified: 2026-09-29
versions: [Claude Code 2.1.284, Codex CLI 0.158.0]
time: 10 分钟
tested: partial
---

# 第 6 章 · Skill 是什么

<PageMeta />

## 一句话解释

**Skill（技能）是一份写给 Agent 的"操作手册"**：一个文件夹，里面有一个 `SKILL.md` 文件，写着"遇到某类任务时应该怎么做"，还可以附带参考资料和脚本。

安装之后，Agent 遇到相关任务时会**自己翻开这本手册**照着做；你也可以直接点名让它用。

举几个例子：
- 一个「中文提交」Skill：规定提交代码前要检查什么、提交说明怎么写；
- 一个「网页规范」Skill：规定做网页只用原生技术、要适配手机、改完要告诉你怎么查看；
- 一个「处理 Excel」Skill：附带几个脚本，教 Agent 怎么正确地读写表格文件。

## 为什么需要 Skill：和 CLAUDE.md 有什么不同

你可能会想：把这些规则写进 `CLAUDE.md` / `AGENTS.md` 不就行了？区别在于**什么时候加载**：

| | CLAUDE.md / AGENTS.md | Skill |
|---|---|---|
| 比喻 | 员工手册：**每天上班都要看** | 工具书：**需要时才翻开** |
| 什么时候读 | 每次对话开始时**全部读入** | 平时只读"目录"，用到时才读全文 |
| 适合写什么 | 简短的、每次都要遵守的规则 | 较长的操作流程、专门领域的知识、附带脚本 |
| 占用上下文 | 始终占用 | 用到才占用 |

所以，**短规则写进 CLAUDE.md，长流程写成 Skill**。这样既能让 Agent 掌握很多专门知识，又不会让每次对话都塞满用不上的内容。

## Skill 是怎么被加载的

Skill 采用"**按需加载**"的设计，分三层：

<figure class="cz-figure">
<svg viewBox="0 0 680 260" role="img" aria-label="Skill 分三层按需加载：第一层是名称和描述，始终加载；第二层是 SKILL.md 正文，任务相关时加载；第三层是辅助文件和脚本，需要时才读取或执行" style="width:100%;height:auto;font-family:var(--vp-font-family-base)">
  <g font-size="14" fill="var(--vp-c-text-1)">
    <rect x="20" y="16" width="640" height="64" rx="12" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)" stroke-width="1.5"/>
    <text x="44" y="44" font-weight="700" fill="var(--vp-c-brand-1)">第 1 层 · 名称和描述</text>
    <text x="44" y="66" font-size="12.5" fill="var(--vp-c-text-2)">每次对话开始时读入，每个只占几十个 token，Agent 靠它判断何时使用</text>
    <text x="636" y="44" font-size="12" text-anchor="end" fill="var(--vp-c-brand-1)">始终加载</text>
    <rect x="60" y="96" width="600" height="64" rx="12" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
    <text x="84" y="124" font-weight="700">第 2 层 · SKILL.md 正文</text>
    <text x="84" y="146" font-size="12.5" fill="var(--vp-c-text-2)">任务和描述匹配、或你点名使用时才读入，里面是具体的步骤和规范</text>
    <text x="636" y="124" font-size="12" text-anchor="end" fill="var(--vp-c-text-2)">用到时加载</text>
    <rect x="100" y="176" width="560" height="64" rx="12" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)" stroke-dasharray="5 4"/>
    <text x="124" y="204" font-weight="700">第 3 层 · 辅助文件和脚本</text>
    <text x="124" y="226" font-size="12.5" fill="var(--vp-c-text-2)">参考资料、模板、脚本，SKILL.md 提到且确实需要时才读取或运行</text>
    <text x="636" y="204" font-size="12" text-anchor="end" fill="var(--vp-c-text-2)">需要时才读</text>
  </g>
</svg>
<figcaption>Skill 的三层按需加载：装很多 Skill 也不会让对话变慢变贵</figcaption>
</figure>

正因为第 1 层非常小，你可以放心地安装很多 Skill。这也意味着：**Skill 的描述（description）写得好不好，决定了 Agent 能不能在正确的时候想起它。**

## 一个 Skill 长什么样

一个 Skill 就是一个文件夹：

```text
beginner-web/                ← 文件夹名一般就是 Skill 的名字
├── SKILL.md                 ← 必须有：说明和操作步骤
└── reference/
    └── checklist.md         ← 可选：辅助资料，需要时才读
```

`SKILL.md` 分两部分，开头用 `---` 包起来的是**元信息**，下面是**正文**：

```markdown
---
name: beginner-web
description: 为编程新手制作网页小项目的规范……在创建或修改网页、小工具时使用。
---

# 新手网页项目规范

用户是编程新手。制作或修改网页时，遵守以下规范。

## 技术选择
- 只用原生 HTML、CSS、JavaScript……
```

| 部分 | 作用 |
|---|---|
| `name` | Skill 的名字，也是你点名调用时用的名字 |
| `description` | **最重要的一项**：写清楚"这个 Skill 做什么、什么时候用"。Agent 就是根据它来决定是否使用这个 Skill |
| 正文 | 具体的操作步骤、规范、示例，用普通的 Markdown 写 |

## Claude Code 和 Codex 通用

Skill 遵循一个叫 **Agent Skills** 的开放格式，Claude Code 和 Codex 都支持。**同一个 Skill 文件夹，复制到两个工具各自的目录里就能用。**

两者的区别主要在"放在哪里"和"怎么点名调用"：

| | Claude Code | Codex |
|---|---|---|
| 对所有项目生效 | `~/.claude/skills/` | `~/.agents/skills/` |
| 只对某个项目生效 | `项目/.claude/skills/` | `项目/.agents/skills/` |
| 查看已安装的 Skill | `/skills` | `/skills` |
| 点名调用 | `/skill名字`，例如 `/zh-commit` | `$skill名字`，例如 `$zh-commit` |
| 自带的 Skill | `/code-review`、`/debug`、`/run`、`/verify` 等 | `$skill-creator`、`$skill-installer` 等 |

::: tip 作者实测
本教程提供的两个示例 Skill（`zh-commit` 和 `beginner-web`），作者已经分别放进两个工具的目录验证过：Claude Code 的 `/skills` 列表里能看到它们，Codex 也能正确读取到它们的名称和描述。
:::

::: details Claude Code 独有的 Skill 功能
Claude Code 在通用格式的基础上扩展了一些功能，比如：
- `disable-model-invocation: true`：只允许你手动调用，Agent 不会自己使用（适合"部署""发布"这类有风险的操作）；
- `allowed-tools`：调用这个 Skill 时，预先批准某些工具，不再逐个询问；
- `$ARGUMENTS`：把调用时附带的参数填进正文，例如 `/fix-issue 123`。

Codex 会忽略这些它不认识的字段，不会报错。但如果你希望 Skill 在两个工具里表现一致，**只用 `name` 和 `description` 两个字段**最稳妥。
:::

## Skill、插件、MCP 有什么区别

学到这里你可能还会听说"插件""MCP"，简单区分一下：

| 概念 | 是什么 | 例子 |
|---|---|---|
| **Skill** | 一份操作手册（文字说明 + 可选的脚本），教 Agent **怎么做** | 中文提交规范、网页制作规范 |
| **MCP** | 一种连接外部服务的接口，给 Agent **新的能力** | 让 Agent 能操作浏览器、查数据库、读飞书文档 |
| **插件** | 一个安装包，可以打包多个 Skill、MCP 和其他配置，方便**分发和安装** | Anthropic 官方插件市场里的各种插件 |

本教程重点讲 Skill，因为它最简单、最通用，自己就能写。

## 接入 DeepSeek 时能用吗

**能。** Skill 本质上是文字说明，任何模型都能读懂并照做。区别在于模型"照着手册办事"的能力：能力越强的模型，越能在合适的时机想起 Skill、严格遵守里面的步骤。

需要注意的是，少数 Skill 依赖特定的服务，比如 Codex 自带的 `imagegen`（生成图片）依赖 OpenAI 的图像服务，接 DeepSeek 时可能无法使用。

## 下一步

- [安装现成的 Skill](./install)：从官方或社区安装别人写好的 Skill
- [编写自己的 Skill](./create)：把你的经验写成 Skill

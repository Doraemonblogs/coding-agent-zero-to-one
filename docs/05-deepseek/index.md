---
banner: /images/banners/ch5.webp
verified: 2026-09-29
versions: [deepseek-v4-pro, deepseek-flash]
time: 10 分钟
tested: partial
---

# 第 5 章 · 准备 DeepSeek API Key

<PageMeta />

## 为什么选 DeepSeek

- **国内直接访问**，不需要代理；
- **两种接口都支持**：它提供和 Anthropic 兼容的接口（给 Claude Code 用），也提供和 OpenAI Responses 兼容的接口（给 Codex 用）；
- **价格便宜**，适合学习和日常使用；
- 国内常见的支付方式就能充值。

::: tip 其他国产模型也可以
智谱 GLM、Kimi、通义千问、MiniMax 等也提供了类似的兼容接口，配置思路和 DeepSeek 一样：换一个地址、换一个 Key、换一个模型名。本教程以 DeepSeek 为例。
:::

## 两个网站别搞混

| 网站 | 是什么 | 能给 Agent 用吗 |
|---|---|---|
| `chat.deepseek.com` | **网页聊天**，免费 | ❌ 不能 |
| `platform.deepseek.com` | **开放平台**，按用量付费，提供 API Key | ✅ **这才是我们要用的** |

## 申请 API Key

::::: steps

### 注册并登录开放平台

打开 **DeepSeek 开放平台**：https://platform.deepseek.com/ ，按提示注册并登录。

### 充值

在「充值」页面充值。学习阶段先充少量金额即可，用完再充。开放平台的「用量信息」页面可以随时查看消耗。

### 创建 API Key

1. 在开放平台左侧菜单进入 **API keys** 页面：https://platform.deepseek.com/api_keys
2. 点击「创建 API key」，起个好认的名字（比如 `claude-code`、`codex`）
3. **立即复制**生成的 Key（`sk-` 开头的一长串字符），保存到安全的地方，比如密码管理器

::: tip 每个工具用一个单独的 Key
给 Claude Code 和 Codex 各创建一个 Key，名字分别标明。以后某个 Key 泄露了，只删掉那一个就行，另一个不受影响；在用量页面也能分别看到每个工具花了多少。
:::

### 验证 Key 可用

在终端里执行下面的命令，把 `<你的 API Key>` 替换成刚才复制的 Key（**尖括号也要删掉**）。这个请求只是查询可用的模型列表，**不产生费用**：

::: code-group
```powershell [Windows PowerShell]
curl.exe https://api.deepseek.com/models -H "Authorization: Bearer <你的 API Key>"
```

```bash [macOS / Linux]
curl https://api.deepseek.com/models -H "Authorization: Bearer <你的 API Key>"
```
:::

::: terminal 你会看到（作者实测，2026-09-29）
```text
{"object":"list","data":[{"id":"deepseek-flash","object":"model","owned_by":"deepseek"},{"id":"deepseek-v4-pro","object":"model","owned_by":"deepseek"}]}
```
:::

- 返回类似上面这样包含 `"id": "deepseek-..."` 的内容：Key 可用；
- 返回 `401` 或 `Authentication Fails`：Key 错了，检查是否复制完整、有没有多余的空格。

:::::

::: danger API Key 只显示一次，并且要像密码一样保管
- 关掉弹窗后就**再也看不到**完整的 Key 了，丢了只能删除后重新创建；
- **不要**发给别人、不要发到群里、不要截图分享；
- **不要**把 Key 写进项目代码里，更不要提交到 Git / GitHub（参考 [.gitignore](../01-environment/git#gitignore-告诉-git-哪些文件不要管)）；
- **不要**在和 Agent 的对话里直接粘贴 Key，对话内容会发送给模型服务商；
- 怀疑泄露了，立即在 API keys 页面**删除**它，再创建一个新的。
:::

::: warning 待实测
注册、实名认证、充值的具体流程作者没有逐步截图验证，以平台实际页面为准。创建 Key 之后的步骤（验证 Key、接入两款工具）作者都已实测。
:::

## 了解模型

截至本文验证时（2026-09），DeepSeek 开放平台提供两个模型：

| 模型名 | 实际版本 | 特点 | 适合 |
|---|---|---|---|
| `deepseek-v4-pro` | DeepSeek-V4-Pro | 能力更强，**不支持**图片输入 | 主力模型，大部分编程任务 |
| `deepseek-flash` | DeepSeek-V4.1-Flash | 更快、便宜很多，**支持**图片输入 | 简单任务、辅助任务、需要看图时 |

两个模型都支持 100 万 token 的上下文。

::: warning 模型名会更新
DeepSeek 的模型更新很快。比如官方价格页注明：旧模型名 `deepseek-v4-flash` 仍可调用，但对应模型已下线，请求会交给 V4.1-Flash 处理，**新配置请使用 `deepseek-flash`**；更早的 `deepseek-chat`、`deepseek-reasoner` 也已被标注为即将废弃。

配置时如果报"模型不存在"，用上面验证 Key 的命令查看你的账号当前可用的模型名，或者到 [DeepSeek API 文档](https://api-docs.deepseek.com/zh-cn/) 查看。
:::

## 关于费用

费用按 **token** 计算（可以粗略理解为"字数"），分三部分计价。下面是官方价格（2026-09，单位：元 / 百万 token）：

| | deepseek-v4-pro | deepseek-flash |
|---|---|---|
| 输入（命中缓存） | 0.15 ～ 0.30 | 0.02 ～ 0.04 |
| 输入（未命中缓存） | 4.5 ～ 9.0 | 1 ～ 2 |
| 输出 | 13.5 ～ 27.0 | 4 ～ 8 |

- 每格的两个数分别是**空闲时段**和**高峰时段**的价格。高峰时段是北京时间工作日 9:00-12:00、14:00-18:00，其余时间（含周末和法定节假日）都是空闲时段，**半价**；
- **命中缓存**的输入非常便宜。Agent 每一轮都会重复发送大量相同的内容（系统提示词、项目说明、之前的对话），这些重复部分大多能命中缓存；
- 具体价格以 [DeepSeek 官方价格页](https://api-docs.deepseek.com/zh-cn/quick_start/pricing) 为准，在开放平台的「用量信息」页面可以查看每天的消耗。

::: info 一个真实的例子
作者用 Claude Code + deepseek-v4-pro 完整做了一遍 [第 7 章的实战项目](../07-practice/)：共 15 步、99 轮对话，Agent 工作了约 17 分钟。输入中有 **98.9%** 命中了缓存，按官方价格估算，总花费约 **2 元（空闲时段）/ 4 元（高峰时段）**。如果没有缓存，同样的用量要 25 元左右。

每一步的详细用量见 [实测记录](https://github.com/doraemonblogs/coding-agent-zero-to-one/blob/HEAD/examples/xiaozhangben/RUN-LOG.md)。
:::

::: tip 省钱的基本思路
- 一个话题做完就开新对话（Claude Code 用 `/clear`，Codex 用 `/new`），不要让对话无限变长；
- 需求说清楚，减少来回返工；
- 简单任务可以切换到更便宜的 flash 模型；
- 不赶时间的大任务，放到空闲时段（晚上、周末）做，价格减半。

更多技巧见 [第 8 章 · 上下文与费用](../08-tips/context)。
:::

::: danger 小心来路不明的"API 中转站"
网上有很多"低价 Claude / GPT 中转"服务。它们能看到你发送的全部代码和对话内容，存在数据泄露、服务跑路、偷换模型等风险。本教程**不推荐**任何中转服务。
:::

## 下一步

根据你安装的工具，继续配置：

- [Claude Code 接入 DeepSeek](./claude-code)
- [Codex 接入 DeepSeek](./codex)

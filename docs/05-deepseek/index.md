# 第 5 章 · 准备 DeepSeek API Key

::: info 版本信息
最后验证：2026-09-29 · 模型名参考 DeepSeek 官方接入指南（2026-09）
:::

## 为什么选 DeepSeek

- **国内直接访问**，不需要代理；
- **两种接口都支持**：它提供和 Anthropic 兼容的接口（给 Claude Code 用），也提供和 OpenAI Responses 兼容的接口（给 Codex 用）；
- **价格便宜**，适合学习和日常使用；
- 国内常见的支付方式就能充值。

::: tip 其他国产模型也可以
智谱 GLM、Kimi、通义千问、MiniMax 等也提供了类似的兼容接口，配置思路和 DeepSeek 一样：换一个地址、换一个 Key、换一个模型名。本教程以 DeepSeek 为例。
:::

## 第 1 步：注册并充值

1. 打开 **DeepSeek 开放平台**：https://platform.deepseek.com/
2. 按提示注册并登录
3. 在「充值」页面充值。学习阶段先充少量金额即可，用完再充

::: warning 注意区分两个网站
- `chat.deepseek.com` 是**网页聊天**，免费，但**不能**给 Claude Code / Codex 用；
- `platform.deepseek.com` 是**开放平台**，按用量付费，**这才是我们要用的**。
:::

::: warning 待实测
注册、实名认证、充值的具体流程作者没有逐步截图验证，以平台实际页面为准。
:::

## 第 2 步：创建 API Key

**API Key**（接口密钥）相当于你账户的**密码**。Claude Code / Codex 拿着它去调用 DeepSeek，费用从你的账户里扣。

1. 在开放平台左侧菜单进入 **API keys** 页面：https://platform.deepseek.com/api_keys
2. 点击「创建 API key」，起个名字（比如 `claude-code`）
3. **立即复制**生成的 Key（形如 `sk-` 开头的一长串字符），保存到安全的地方

::: danger API Key 只显示一次，并且要像密码一样保管
- 关掉弹窗后就**再也看不到**完整的 Key 了，丢了只能删除后重新创建；
- **不要**发给别人、不要发到群里、不要截图分享；
- **不要**把 Key 写进项目代码里，更不要提交到 Git / GitHub；
- 怀疑泄露了，立即在 API keys 页面**删除**它，再创建一个新的。
:::

## 第 3 步：验证 Key 可用

在终端里执行下面的命令，把 `<你的 API Key>` 替换成刚才复制的 Key（**尖括号也要删掉**）。这个请求只是查询可用的模型列表，**不产生费用**：

::: code-group
```powershell [Windows PowerShell]
curl.exe https://api.deepseek.com/models -H "Authorization: Bearer <你的 API Key>"
```

```bash [macOS / Linux]
curl https://api.deepseek.com/models -H "Authorization: Bearer <你的 API Key>"
```
:::

- 返回一段包含 `"id": "deepseek-..."` 的内容：Key 可用；
- 返回 `401` 或 `Authentication Fails`：Key 错了，检查是否复制完整、有没有多余的空格。

## 了解模型

截至本文验证时，DeepSeek 官方给 Agent 场景推荐的模型是：

| 模型名 | 特点 | 适合 |
|---|---|---|
| `deepseek-v4-pro` | 能力更强 | 主力模型，大部分编程任务 |
| `deepseek-v4-flash` / `deepseek-flash` | 更快、更便宜 | 简单任务、辅助任务 |

::: warning 模型名会更新
DeepSeek 的模型更新很快，模型名也会随之变化（例如较早的 `deepseek-chat`、`deepseek-reasoner` 已被官方标注为即将废弃）。配置时如果报"模型不存在"，请到 [DeepSeek API 文档](https://api-docs.deepseek.com/zh-cn/) 查看最新的模型名。
:::

## 关于费用

- 费用按 **token**（可以粗略理解为"字数"）计算，输入和输出分开计价；
- Agent 每一轮都会把项目文件、对话历史发给模型，**一次任务消耗的 token 往往比网页聊天多得多**；
- 具体价格以 [DeepSeek 官方价格页](https://api-docs.deepseek.com/zh-cn/quick_start/pricing) 为准；
- 在开放平台的「用量信息」页面可以查看每天的消耗。

::: tip 省钱的基本思路
- 一个话题做完就开新对话（Claude Code 用 `/clear`，Codex 用 `/new`），不要让对话无限变长；
- 需求说清楚，减少来回返工；
- 简单任务可以切换到更便宜的 flash 模型。

更多技巧会在第 8 章介绍。
:::

## 下一步

根据你安装的工具，继续配置：

- [Claude Code 接入 DeepSeek](./claude-code)
- [Codex 接入 DeepSeek](./codex)

::: danger 小心来路不明的"API 中转站"
网上有很多"低价 Claude / GPT 中转"服务。它们能看到你发送的全部代码和对话内容，存在数据泄露、服务跑路、偷换模型等风险。本教程**不推荐**任何中转服务。
:::

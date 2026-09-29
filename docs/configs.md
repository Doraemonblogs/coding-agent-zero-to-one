---
verified: 2026-09-29
versions: [Claude Code 2.1.284, Codex CLI 0.158.0]
---

# 配置模板

<PageMeta />

这里汇总了教程中用到的配置文件，方便直接复制。每个配置的详细解释和操作步骤，请看对应的教程页面。

模板文件也存放在仓库的 [`configs/`](https://github.com/doraemonblogs/coding-agent-zero-to-one/tree/HEAD/configs) 目录中。

## Claude Code 接入 DeepSeek

- 放到：`~/.claude/settings.json`（Windows：`C:\Users\你的用户名\.claude\settings.json`）
- 需要替换：`<你的 DeepSeek API Key>`
- 另外还要执行一步"跳过官方登录"
- 详细步骤：[Claude Code 接入 DeepSeek](./05-deepseek/claude-code)

<<< @/../configs/claude-code/settings.deepseek.json

## Codex 接入 DeepSeek

- 放到：`~/.codex/config.toml`（Windows：`C:\Users\你的用户名\.codex\config.toml`）
- 需要先设置环境变量 `DEEPSEEK_API_KEY`，配置文件本身不含 Key
- 这是"手动配置"的写法；不想手动改，也可以用 DeepSeek 官方的 [一键脚本](./05-deepseek/codex#方式一-deepseek-官方一键脚本)
- 详细步骤：[Codex 接入 DeepSeek](./05-deepseek/codex)

<<< @/../configs/codex/config.deepseek.toml

# 配置模板

本目录存放教程中用到的配置文件模板，可以直接复制使用。

| 文件 | 放到哪里 | 说明 |
|---|---|---|
| [`claude-code/settings.deepseek.json`](claude-code/settings.deepseek.json) | `~/.claude/settings.json` | Claude Code 接入 DeepSeek。需要把 `<你的 DeepSeek API Key>` 替换成真实的 Key |
| [`codex/config.deepseek.toml`](codex/config.deepseek.toml) | `~/.codex/config.toml` | Codex 接入 DeepSeek。Key 从环境变量 `DEEPSEEK_API_KEY` 读取，文件本身不含 Key |

详细步骤见教程：

- [Claude Code 接入 DeepSeek](../docs/05-deepseek/claude-code.md)
- [Codex 接入 DeepSeek](../docs/05-deepseek/codex.md)

> 模板最后验证时间：2026-09-29（Claude Code 2.1.284，Codex CLI 0.158.0）。

# Codex 接入 DeepSeek

::: info 版本信息
最后验证：2026-09-29 · Codex CLI 0.158.0
- ✅ 已实测：配置文件能被 Codex 正确加载（`codex doctor` 显示配置解析成功、读取到 API Key 环境变量、请求地址正确）
- ⚠️ 待实测：真实调用 DeepSeek 完成任务（作者的测试环境无法访问 DeepSeek）
:::

## 原理

Codex 使用 OpenAI 的 **Responses API** 格式和模型通信。DeepSeek 现在原生支持这个格式，接口地址是：

```
https://api.deepseek.com
```

所以只要在 Codex 的配置文件里**添加一个"模型提供方"**，告诉它地址、Key 和模型名即可，不需要任何额外的转发工具。

::: tip 网上的旧教程可能已经不适用
Codex 早期版本支持 `wire_api = "chat"` 的写法，很多旧教程都用它接入 DeepSeek。**新版 Codex 已经移除了这个选项**，照抄会报错 `wire_api = "chat" is no longer supported`。本页的写法是 `wire_api = "responses"`。
:::

## 第 1 步：把 API Key 设为环境变量

Codex 推荐从**环境变量**读取 API Key，而不是直接写在配置文件里。我们把 Key 保存到一个名为 `DEEPSEEK_API_KEY` 的永久环境变量中（不熟悉环境变量的话，回顾 [认识终端 · 环境变量](../01-environment/terminal#环境变量是什么)）。

把 `<你的 DeepSeek API Key>` 替换成你的 Key（尖括号删掉，引号保留）：

::: code-group
```powershell [Windows PowerShell]
[Environment]::SetEnvironmentVariable("DEEPSEEK_API_KEY", "<你的 DeepSeek API Key>", "User")
```

```bash [macOS]
echo 'export DEEPSEEK_API_KEY="<你的 DeepSeek API Key>"' >> ~/.zshrc
```

```bash [Linux（bash）]
echo 'export DEEPSEEK_API_KEY="<你的 DeepSeek API Key>"' >> ~/.bashrc
```
:::

然后**关掉终端，重新打开一个**，检查是否设置成功：

::: code-group
```powershell [Windows PowerShell]
$env:DEEPSEEK_API_KEY
```

```bash [macOS / Linux]
echo $DEEPSEEK_API_KEY
```
:::

能输出你的 Key 就对了。

::: tip Windows 也可以用图形界面设置
开始菜单搜索「编辑账户的环境变量」→ 在「用户变量」中点击「新建」→ 变量名填 `DEEPSEEK_API_KEY`，变量值填你的 Key。
:::

## 第 2 步：编辑 config.toml

Codex 的配置文件位于：

| 系统 | 路径 |
|---|---|
| Windows | `C:\Users\你的用户名\.codex\config.toml` |
| macOS / Linux | `~/.codex/config.toml` |

用 VS Code 打开它（不存在的话保存时会自动创建）：

::: code-group
```powershell [Windows PowerShell]
New-Item -ItemType Directory -Force "$HOME\.codex" | Out-Null
code "$HOME\.codex\config.toml"
```

```bash [macOS / Linux]
mkdir -p ~/.codex
code ~/.codex/config.toml
```
:::

把下面的内容复制进去并保存。**这份配置里没有 Key**，不需要做任何替换：

```toml
model = "deepseek-v4-pro"
model_provider = "deepseek"
model_reasoning_effort = "high"

[model_providers.deepseek]
name = "DeepSeek"
base_url = "https://api.deepseek.com"
env_key = "DEEPSEEK_API_KEY"
wire_api = "responses"
```

::: warning 如果 config.toml 里原来就有内容
把前三行（`model`、`model_provider`、`model_reasoning_effort`）放在文件**最开头**，替换掉原来的同名项；`[model_providers.deepseek]` 这一段放在文件**末尾**。TOML 格式中，`[xxx]` 这样的标题下面的内容都属于这个标题，所以顶层的配置项必须写在所有 `[xxx]` 标题之前。
:::

### 每一行是什么意思

| 配置项 | 含义 |
|---|---|
| `model` | 默认使用的模型 |
| `model_provider` | 使用哪个模型提供方，对应下面 `[model_providers.deepseek]` 里的 `deepseek` |
| `model_reasoning_effort` | 模型思考的深度。DeepSeek 支持 `low`、`high` 等档位 |
| `[model_providers.deepseek]` | 定义一个名为 `deepseek` 的模型提供方 |
| `name` | 显示名称，随便起 |
| `base_url` | 请求发送的地址 |
| `env_key` | 从哪个**环境变量**读取 API Key，对应第 1 步设置的 `DEEPSEEK_API_KEY` |
| `wire_api` | 通信格式，必须是 `responses` |

## 第 3 步：验证

**关掉终端，重新打开一个**，先运行诊断命令：

```bash
codex doctor
```

重点看这几行：

```
Configuration
  ✓ config       loaded
      model                    deepseek-v4-pro · deepseek
      config.toml parse        ok
  ✓ auth         auth is provided by the active model provider
      provider auth env var    DEEPSEEK_API_KEY (present)
...
Connectivity
  ✓ reachability ...
```

| 看到的内容 | 说明 |
|---|---|
| `config.toml parse ok` | 配置文件格式正确 |
| `DEEPSEEK_API_KEY (present)` | 成功读到了 API Key 环境变量 |
| `✗ auth  active model provider auth env var is missing` 和 `DEEPSEEK_API_KEY (missing)` | 没读到 Key，回到第 1 步检查，并确认已经重新打开终端 |
| `reachability` 一行是 `✓` | 能连上 DeepSeek |

然后做一次真实调用，进入练习项目，用非交互模式问一句话：

```bash
cd ~/ai-playground
codex exec "用一句话介绍你自己"
```

能输出一段回答，就说明接入成功了。再到 DeepSeek 开放平台的「用量信息」页面确认有调用记录。

**接入完成！** 接下来去看 [Codex 第一次上手](../04-codex/basics)。

## 进阶：使用 DeepSeek 官方的一键配置

DeepSeek 官方文档提供了 Codex 的一键配置脚本。除了写入上面这样的配置，它还会额外生成一份**模型信息文件**，告诉 Codex 每个模型的上下文长度、支持的推理档位、是否支持图片等，让 Codex 的表现更好。

如果你能正常访问 DeepSeek 文档，可以在 [DeepSeek API 文档](https://api-docs.deepseek.com/zh-cn/) 的 Agent 集成部分找到 Codex 的接入说明，按官方步骤操作。

::: warning 待实测
作者的测试环境无法访问 DeepSeek 文档站，没有验证官方一键脚本。本页的手动配置和官方脚本生成的核心配置是一致的，只是少了模型信息文件。
:::

## 已知限制

- **图片**：`deepseek-v4-pro` 不支持图片输入；需要识别图片时，可以把模型换成 DeepSeek 官方标注支持图片的 flash 模型；
- 部分依赖 OpenAI 服务的功能（如 ChatGPT 账号的用量统计、云端任务）不可用。

## 常见问题

**报错 `wire_api = "chat" is no longer supported`**
- 你参考了旧教程。把 `wire_api` 改成 `"responses"`。

**启动时要求登录 ChatGPT**
- 检查 `model_provider = "deepseek"` 是否写在文件开头、所有 `[xxx]` 标题之前。

**报错 401 / 认证失败**
- 运行 `codex doctor` 看 `provider auth env var` 一行，确认读到了 Key；
- 确认 Key 本身正确（可以用 [第 5 章开头的方法](./#第-3-步-验证-key-可用) 验证）。

**报错 402 / 余额不足**
- 去 DeepSeek 开放平台充值。

**报错模型不存在**
- 模型名可能更新了，对照 [DeepSeek API 文档](https://api-docs.deepseek.com/zh-cn/) 修改 `model` 一行。

更多问题见 [常见问题](../faq/)。

## 想换回 ChatGPT 账号？

把 `config.toml` 开头的 `model_provider = "deepseek"` 删掉（或在行首加 `#` 注释掉），`model` 改回 OpenAI 的模型名或删掉，重新启动 Codex 按提示登录即可。

---
verified: 2026-09-29
versions: [Codex CLI 0.158.0]
time: 15 分钟
tested: full
---

# Codex 接入 DeepSeek

<PageMeta />

::: info 验证情况
- ✅ 已实测（2026-09-29，Linux）：两种方式都能正常工作——`codex doctor` 检查通过、`codex exec` 一问一答、交互界面里写文件、执行命令、审批、使用 Skill
- ⚠️ 未实测：Windows 版一键脚本（`.ps1`）没有在 Windows 真机上运行过；手动配置的写法三个系统相同
:::

## 原理

Codex 使用 OpenAI 的 **Responses API** 格式和模型通信。DeepSeek 现在原生支持这个格式，接口地址是：

```text
https://api.deepseek.com
```

所以只要在 Codex 的配置文件 `config.toml` 里**添加一个"模型提供方"**，告诉它地址、Key 和模型名即可，不需要任何额外的转发工具。

::: tip 网上的旧教程可能已经不适用
Codex 早期版本支持 `wire_api = "chat"` 的写法，很多旧教程都用它接入 DeepSeek。**新版 Codex 已经移除了这个选项**，照抄会报错 `wire_api = "chat" is no longer supported`。本页的写法是 `wire_api = "responses"`。
:::

## 两种方式，选一种

| | 方式一：官方一键脚本 | 方式二：手动配置 |
|---|---|---|
| 操作 | 运行一行命令，按提示选模型、粘贴 Key | 自己设置环境变量、编辑配置文件 |
| 额外好处 | 同时写入**模型信息文件**，Codex 能准确知道模型的上下文长度、推理档位等 | 能弄懂每一行配置的含义 |
| API Key 存在哪 | **明文**写在 `config.toml` 里 | 存在环境变量里，配置文件可以放心分享 |
| 适合 | 想最快用起来的读者（**推荐新手**） | 想弄懂原理，或者会把配置文件分享、同步给别人的读者 |

## 方式一：DeepSeek 官方一键脚本

这个脚本来自 [DeepSeek 官方文档](https://api-docs.deepseek.com/zh-cn/)，会自动修改 Codex 的配置，并在修改前**备份**原来的配置。

::::: steps

### 确认 Codex 已安装

```bash
codex --version
```

能输出版本号就可以继续（脚本会检查这一点）。Windows 用户再执行一行，确保 Codex 的配置文件夹存在（Windows 版脚本会检查这个文件夹）：

```powershell
New-Item -ItemType Directory -Force "$HOME\.codex" | Out-Null
```

### 运行脚本

::: code-group
```powershell [Windows PowerShell]
irm https://cdn.deepseek.com/api-docs/codex-deepseek-setup.ps1 | iex
```

```bash [macOS / Linux]
bash <(curl -fsSL https://cdn.deepseek.com/api-docs/codex-deepseek-setup.sh)
```
:::

::: tip 下载失败？
作者测试时偶尔遇到下载中断（连接被重置），过一会儿重新运行一次就好了。
:::

### 选择模型

::: terminal 你会看到
```text
请选择要执行的操作：
  1. 修改 Codex 配置，使用 deepseek-flash 模型
  2. 修改 Codex 配置，使用 deepseek-v4-pro 模型
  9. 恢复默认的 Codex 配置（删除 deepseek 相关配置）
```
:::

输入 `2`（用能力更强的 `deepseek-v4-pro`），按 <kbd>Enter</kbd>。

### 粘贴 API Key

看到 `请输入 DeepSeek API key（以 sk- 开头）` 时，粘贴你的 Key，按 <kbd>Enter</kbd>。粘贴时屏幕上可能什么都不显示，这是正常的保护措施。

::: tip 已经设置了 DEEPSEEK_API_KEY 环境变量？
macOS / Linux 版脚本发现这个环境变量后，会直接使用它，跳过这一步。
:::

### 看到"安装完成"

::: terminal 你会看到（节选，作者实测）
```text
校验
✓ models.json 是合法 JSON
✓ config.toml 可解析，无重复 key

✓ 安装完成。
```
:::

后面还会提示"请完全退出 ChatGPT 桌面端后重新打开"——那是给 ChatGPT 桌面客户端用户看的，只用 Codex CLI 可以忽略。

:::::

脚本做了这几件事：

- 把原来的配置备份到 `~/.codex/backup-deepseek` 文件夹；
- 生成 `~/.codex/models.json`（模型信息文件）；
- 在 `~/.codex/config.toml` 里写入 DeepSeek 的配置，**包括你的 API Key**。

想换模型或者恢复原样，**再运行一次脚本**：选 1 / 2 重新写入，选 9 恢复到安装前的配置。

::: warning 用这种方式，config.toml 里有你的 Key
不要把 `~/.codex/config.toml` 发给别人，也不要截图分享。求助时需要展示配置，先把 `experimental_bearer_token = "sk-..."` 这一行的 Key 删掉。
:::

配置好之后，跳到下面的 [验证](#验证) 一节。

## 方式二：手动配置


::::: steps

### 把 API Key 设为环境变量

Codex 推荐从**环境变量**读取 API Key，而不是直接写在配置文件里（这样配置文件可以放心地分享给别人）。我们把 Key 保存到一个名为 `DEEPSEEK_API_KEY` 的永久环境变量中（不熟悉环境变量的话，回顾 [认识终端 · 环境变量](../01-environment/terminal#环境变量是什么)）。

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

::: tip Windows 也可以用图形界面设置
开始菜单搜索「编辑账户的环境变量」→ 在「用户变量」中点击「新建」→ 变量名填 `DEEPSEEK_API_KEY`，变量值填你的 Key → 确定。
:::

### 确认环境变量设置成功

**关掉终端，重新打开一个**，检查：

::: code-group
```powershell [Windows PowerShell]
$env:DEEPSEEK_API_KEY
```

```bash [macOS / Linux]
echo $DEEPSEEK_API_KEY
```
:::

能输出你的 Key 就对了。如果输出为空，说明没设置成功，或者还没重新打开终端。

### 打开 config.toml

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

### 填入配置

把下面的内容复制进去并保存。**这份配置里没有 Key**，不需要做任何替换：

```toml
model = "deepseek-v4-pro"
model_provider = "deepseek"
model_reasoning_effort = "high"
web_search = "disabled"

[model_providers.deepseek]
name = "DeepSeek"
base_url = "https://api.deepseek.com"
env_key = "DEEPSEEK_API_KEY"
wire_api = "responses"
```

::: warning 如果 config.toml 里原来就有内容
把前四行（`model`、`model_provider`、`model_reasoning_effort`、`web_search`）放在文件**最开头**，替换掉原来的同名项；`[model_providers.deepseek]` 这一段放在文件**末尾**。

TOML 格式中，`[xxx]` 这样的标题下面的内容都属于这个标题，所以**顶层的配置项必须写在所有 `[xxx]` 标题之前**，否则会被当成上一个标题的一部分。
:::

:::::

### 每一行配置是什么意思

| 配置项 | 含义 |
|---|---|
| `model` | 默认使用的模型 |
| `model_provider` | 使用哪个模型提供方，对应下面 `[model_providers.deepseek]` 里的 `deepseek` |
| `model_reasoning_effort` | 模型思考的深度，常用 `high` |
| `web_search` | Codex 内置的联网搜索依赖 OpenAI 的服务，DeepSeek 不支持，DeepSeek 官方脚本也会把它关掉 |
| `[model_providers.deepseek]` | 定义一个名为 `deepseek` 的模型提供方 |
| `name` | 显示名称，随便起 |
| `base_url` | 请求发送的地址 |
| `env_key` | 从哪个**环境变量**读取 API Key，对应第 1 步设置的 `DEEPSEEK_API_KEY` |
| `wire_api` | 通信格式，必须是 `responses` |

## 验证

两种方式配置完，都按下面的步骤验证。

::::: steps

### 用诊断命令检查

**关掉终端，重新打开一个**，运行：

```bash
codex doctor
```

::: terminal 你会看到（节选，作者实测，方式二）
```text
Configuration
  ✓ config       loaded
      model                    deepseek-v4-pro · deepseek
      config.toml parse        ok
      provider auth env var    DEEPSEEK_API_KEY (present)
Connectivity
  ✓ reachability active provider endpoints are reachable over HTTP
      deepseek API inference URL https://api.deepseek.com/responses reachable (HTTP 405)
```
:::

| 看到的内容 | 说明 |
|---|---|
| `config.toml parse ok` | 配置文件格式正确 |
| `DEEPSEEK_API_KEY (present)` | （方式二）成功读到了 API Key 环境变量 |
| `DEEPSEEK_API_KEY (missing)` | （方式二）没读到 Key，回到方式二第 1 步检查，并确认已经重新打开终端 |
| `reachability` 一行是 `✓` | 能连上 DeepSeek |

::: tip 最后那个 HTTP 405 是什么？
诊断命令只是"敲敲门"，看看这个地址有没有人应答，并不真的发起对话。`405` 的意思是"门后有人，只是不接受这种敲门方式"——**说明地址是通的**，不是错误。
:::

### 真实调用一次

进入练习项目，用非交互模式问一句话：

```bash
cd ~/ai-playground
codex exec "用一句话介绍你自己"
```

::: terminal 你会看到（作者实测，约 3 秒）
```text
OpenAI Codex v0.158.0
--------
workdir: /home/xiaoming/ai-playground
model: deepseek-v4-pro
provider: deepseek
approval: never
sandbox: read-only
reasoning effort: high
--------
user
用一句话介绍你自己
codex
我是 Codex，一个能直接读写代码、运行命令、排查问题并帮你完成开发任务的终端编程助手。
tokens used
9,096
```
:::

看到 `provider: deepseek` 和一段回答，就说明接入成功了。再到 DeepSeek 开放平台的「用量信息」页面确认有调用记录。

::: tip 只问了一句话，为什么用了 9000 多个 token？
每次请求，Codex 都会把一大段"系统说明"（它的身份、规则、能用哪些工具）一起发给模型，这部分就有好几千 token。好在这些重复内容大多能**命中缓存**，价格很低。详见 [上下文与费用](../08-tips/context)。
:::

:::::

**接入完成！** 接下来去看 [Codex 第一次上手](../04-codex/basics)。

### 可能看到的几行提示

真实调用时，回答前面可能夹着几行 `warning`，**都不影响使用**：

| 提示 | 出现在 | 意思 |
|---|---|---|
| `Model metadata for 'deepseek-v4-pro' not found. Defaulting to fallback metadata` | 方式二 | Codex 没有这个模型的"说明书"（上下文多长、支持哪些档位），先用默认值。作者用方式二完成了第 4 章的全部操作，没有遇到问题。想去掉它，改用方式一（脚本会写入模型信息文件） |
| `` `preferred_auth_method` is ignored `` | 方式一 | 脚本写了一个新版 Codex 已经不用的配置项，Codex 忽略它而已 |
| 一段英文，比如 `The user is asking in Chinese for...` | 方式一 | 这是模型**思考过程的原文**。脚本打开了 `show_raw_agent_reasoning = true`，不想看的话，把 `config.toml` 里这一行删掉 |
| `Codex could not find bubblewrap on PATH` | Linux | Linux 上的沙箱组件，Codex 会自动用自带的版本。想消除提示，用系统的包管理器安装 `bubblewrap` |

## 已知限制

- **图片**：`deepseek-v4-pro` 不支持图片输入；需要识别图片时，可以把模型换成支持图片的 `deepseek-flash`；
- **联网搜索**：Codex 内置的网页搜索不可用（配置里已经关掉）；
- 部分依赖 OpenAI 服务的功能（如 ChatGPT 账号的用量统计、云端任务）不可用。

## 常见问题

**报错 `401 Unauthorized ... url: https://api.openai.com/v1/responses`**
- 注意看网址：请求发去了 **OpenAI**，而不是 DeepSeek，说明你的 DeepSeek 配置**根本没生效**。作者实测，没配置好就直接运行时，会先反复出现 `Reconnecting... 1/5` 到 `5/5`，最后报这个错；
- 检查 `config.toml` 是否保存在了正确的位置（`~/.codex/config.toml`）、`model_provider = "deepseek"` 是否写在文件开头；
- 用了方式一：确认脚本最后显示了"安装完成"。

**报错 `wire_api = "chat" is no longer supported`**
- 你参考了旧教程。把 `wire_api` 改成 `"responses"`。

**启动时要求登录 ChatGPT**
- 检查 `model_provider = "deepseek"` 是否写在文件开头、所有 `[xxx]` 标题之前。

**报错 401，但网址是 api.deepseek.com**
- 配置生效了，但 Key 不对。方式二：运行 `codex doctor` 看 `provider auth env var` 一行，确认读到了 Key；方式一：重新运行脚本输入正确的 Key；
- 确认 Key 本身正确（可以用 [第 5 章开头的方法](./#验证-key-可用) 验证）。

**一键脚本提示"未检测到 Codex CLI"或"未找到 Codex 配置目录"**
- 先按 [安装 Codex CLI](../04-codex/) 装好，确认 `codex --version` 能输出版本号；
- Windows：执行方式一第 1 步里创建文件夹的那行命令，再重新运行脚本。

**报错 402 / 余额不足**
- 去 DeepSeek 开放平台充值。

**报错模型不存在**
- 模型名可能更新了，对照 [DeepSeek API 文档](https://api-docs.deepseek.com/zh-cn/) 修改 `model` 一行；用方式一的话，重新运行最新版的脚本即可。

更多问题见 [常见问题](../faq/)。

## 想换回 ChatGPT 账号？

- 用了方式一：重新运行脚本，选 `9`，恢复到安装前的配置；
- 用了方式二：把 `config.toml` 开头的 `model_provider = "deepseek"` 删掉（或在行首加 `#` 注释掉），`model` 改回 OpenAI 的模型名或删掉。

然后重新启动 Codex，按提示登录即可。

如果需要在多个模型服务之间频繁切换，可以了解开源工具 [CC Switch](https://github.com/farion1231/cc-switch)。

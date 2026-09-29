---
verified: 2026-09-29
versions: [Claude Code 2.1.284]
time: 15 分钟
tested: partial
---

# Claude Code 接入 DeepSeek

<PageMeta />

::: info 验证情况
- ✅ 已实测：配置文件格式、跳过登录的命令、启动后界面显示 DeepSeek 模型名和 Manual 模式（Linux）
- ⚠️ 待实测：真实调用 DeepSeek 完成任务（作者的测试环境暂时无法访问 DeepSeek）
:::

## 原理

Claude Code 默认把请求发给 Anthropic 的服务器。DeepSeek 提供了一个**和 Anthropic 格式兼容**的接口地址：

```text
https://api.deepseek.com/anthropic
```

我们只需要告诉 Claude Code 三件事：**请求发到哪里**（地址）、**用什么身份**（API Key）、**用哪个模型**。这些都写在 Claude Code 的配置文件 `settings.json` 里。

## 配置步骤

::::: steps

### 打开 settings.json

Claude Code 的用户配置文件位于：

| 系统 | 路径 |
|---|---|
| Windows | `C:\Users\你的用户名\.claude\settings.json` |
| macOS / Linux | `~/.claude/settings.json` |

用 VS Code 打开它（文件或文件夹不存在也没关系，保存时会自动创建）：

::: code-group
```powershell [Windows PowerShell]
New-Item -ItemType Directory -Force "$HOME\.claude" | Out-Null
code "$HOME\.claude\settings.json"
```

```bash [macOS / Linux]
mkdir -p ~/.claude
code ~/.claude/settings.json
```
:::

::: tip 没装 VS Code？
Windows 可以把 `code` 换成 `notepad`（记事本）；macOS 可以先执行 `touch ~/.claude/settings.json`，再执行 `open -e ~/.claude/settings.json` 用「文本编辑」打开。

用记事本保存时，务必确认文件名是 `settings.json` 而**不是** `settings.json.txt`（参考 [显示文件扩展名](../01-environment/terminal#显示隐藏文件和文件扩展名)）。
:::

### 填入配置

把下面的内容**完整复制**进去，然后把 `<你的 DeepSeek API Key>` 替换成你的 Key（**尖括号也要删掉**，引号要保留），保存：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "<你的 DeepSeek API Key>",
    "ANTHROPIC_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash[1m]",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "CLAUDE_CODE_EFFORT_LEVEL": "max"
  },
  "permissions": {
    "defaultMode": "default"
  }
}
```

替换后，那一行应该类似这样：

```json
    "ANTHROPIC_AUTH_TOKEN": "sk-1a2b3c4d5e6f...",
```

::: warning 如果 settings.json 里原来就有内容
说明你之前用过 Claude Code。**不要整个覆盖**，把上面 `env` 里的各项合并进原来的 `env` 里（没有 `env` 就整块加上）。

JSON 格式要求严格：
- 每一项之间用**英文逗号**分隔，最后一项后面**不能**有逗号；
- 所有引号都是**英文双引号** `"`；
- 大括号 `{ }` 要成对出现。

VS Code 会用红色波浪线标出格式错误，保存前看一眼。
:::

### 跳过官方登录

只配置 `settings.json` 还不够。作者实测发现：Claude Code 第一次启动时，**仍然会弹出 Anthropic 账号登录界面**。需要在另一个文件 `~/.claude.json`（注意：它在**用户主目录**下，不在 `.claude` 文件夹里）中标记"已完成初始设置"。

在终端里执行下面这一行命令。它用 Node.js 修改 `~/.claude.json`：文件不存在就创建，已经存在就只添加这一项，不会动原有内容：

```bash
node -e "const fs=require('fs'),p=require('path').join(require('os').homedir(),'.claude.json');let j={};if(fs.existsSync(p)){j=JSON.parse(fs.readFileSync(p,'utf8'))}j.hasCompletedOnboarding=true;fs.writeFileSync(p,JSON.stringify(j,null,2));console.log('OK: '+p)"
```

::: terminal 你会看到
```text
OK: C:\Users\xiaoming\.claude.json
```
:::

Windows 和 macOS 都用这同一行命令。

:::: details 想手动改？
如果 `~/.claude.json` 不存在，新建它，内容为：

```json
{
  "hasCompletedOnboarding": true
}
```

如果已经存在（里面会有很多内容），在最外层的 `{` 后面加一行 `"hasCompletedOnboarding": true,`，注意末尾的英文逗号。
::::

### 检查配置文件

```bash
claude doctor
```

如果 `settings.json` 有格式错误，这里会指出来。最后一行显示 `No installation issues found.` 就可以继续。

### 快速测试

**关掉终端，重新打开一个**，进入练习项目，用"一问一答"模式测试一下（不进入交互界面）：

```bash
cd ~/ai-playground
claude -p "用一句话介绍你自己"
```

几秒到几十秒后输出一段回答，就说明已经连上 DeepSeek 了。

::: tip 它说自己是 Claude？
很正常。Claude Code 发给模型的系统提示词里写着"你是 Claude Code"，所以模型可能会这样自称。判断是否接入成功，要看下一步的界面显示和 DeepSeek 平台上的用量记录。
:::

### 进入交互界面确认

```bash
claude
```

出现**信任文件夹**的询问时，按 <kbd>↓</kbd> 选中 `Yes, I trust this folder`，再按 <kbd>Enter</kbd>（默认选中的是 `No, exit`，直接回车会退出）。

::: terminal 你会看到
```text
 Claude Code v2.1.284
 deepseek-v4-pro[1m] · API Usage Billing
 ~/ai-playground
                                              ◈ max · /effort
────────────────────────────────────────────────────────────────
❯
────────────────────────────────────────────────────────────────
  ⏸ manual mode on · ? for shortcuts
```
:::

对照检查：
- 第二行显示 `deepseek-v4-pro[1m]`：模型配置生效；
- 右侧显示 `max`：思考深度配置生效；
- 底部显示 `⏸ manual mode on`：权限模式配置生效。

最后，到 DeepSeek 开放平台的「用量信息」页面看一眼，应该能看到刚才的调用记录。

:::::

**接入完成！** 接下来去看 [Claude Code 第一次上手](../03-claude-code/basics)。

## 每一行配置是什么意思

| 配置项 | 含义 |
|---|---|
| `ANTHROPIC_BASE_URL` | 请求发送的地址，指向 DeepSeek 的 Anthropic 兼容接口 |
| `ANTHROPIC_AUTH_TOKEN` | 你的 DeepSeek API Key |
| `ANTHROPIC_MODEL` | 默认使用的模型 |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` 等三项 | Claude Code 内部把模型分为 Opus / Sonnet / Haiku 三档，分别用于不同场景（比如 Haiku 档用于一些轻量的后台任务）。这里把它们都映射到 DeepSeek 的模型上 |
| 模型名后面的 `[1m]` | 告诉 Claude Code 这个模型支持 **100 万 token** 的上下文。Claude Code 会据此判断什么时候需要压缩对话 |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 关闭非必要的网络请求（如使用统计上报）。这些请求要发往 Anthropic 的服务器，在国内会连接失败，关掉可以避免报错和卡顿 |
| `CLAUDE_CODE_EFFORT_LEVEL` | 模型思考的深度，`max` 为最深。DeepSeek 官方推荐 `max`；想更快、更省，可以改成 `high` |
| `permissions.defaultMode` | 启动时的权限模式。`default` 即 **Manual（手动）模式**，每次修改文件、执行命令都会先问你。这是本教程额外加的，原因见 [权限模式](../03-claude-code/basics#权限模式) |

::: tip 这份配置和 DeepSeek 官方文档的关系
`env` 部分和 [DeepSeek 官方的 Claude Code 接入指南](https://github.com/deepseek-ai/awesome-deepseek-agent/blob/main/docs/claude_code.zh-CN.md)（2026-09）完全一致。如果官方更新了模型名，以官方为准。
:::

## 已知限制

通过兼容接口使用时，部分 Claude Code 的功能可能无法使用或表现不同：

- **图片**：粘贴截图让它识别，可能不支持；
- **联网搜索**：Claude Code 内置的网页搜索依赖 Anthropic 的服务，可能无法使用；
- **Auto 权限模式**：依赖 Claude 模型做安全审核，接 DeepSeek 时能否正常工作未经验证，所以本教程默认用 Manual 模式；
- **插件市场**：官方插件市场托管在 GitHub 上，国内网络可能无法访问（第 6 章会介绍不依赖插件市场的 Skill 安装方法）；
- **费用显示**：`/usage` 显示的费用可能按 Claude 的价格估算，以 DeepSeek 平台账单为准。

## 常见问题

**启动后还是要求登录**
- 检查「跳过官方登录」这一步是否执行成功；
- 运行 `claude doctor`，检查 `settings.json` 的格式是否正确。

**报错 401 / Authentication Fails**
- API Key 不对。检查是否复制完整、有没有多余的空格、尖括号是否删掉了。

**报错 402 / Insufficient Balance**
- DeepSeek 账户余额不足，去开放平台充值。

**报错"模型不存在"（model not found 之类）**
- 模型名写错了，或者 DeepSeek 更新了模型名。对照 [DeepSeek API 文档](https://api-docs.deepseek.com/zh-cn/) 修改 `settings.json` 里的模型名。

**配置了但好像没生效**
- 修改 `settings.json` 之后，要**退出 Claude Code 重新启动**；
- 检查系统里是否设置了 `ANTHROPIC_API_KEY` 之类的同名环境变量，它们可能和配置文件冲突。

更多问题见 [常见问题](../faq/)。

## 想换回官方账号？

删掉 `settings.json` 里 `env` 中的这些配置，重新启动 Claude Code，输入 `/login` 登录即可。

如果需要在多个模型服务之间频繁切换，可以了解一下开源工具 [CC Switch](https://github.com/farion1231/cc-switch)，它提供图形界面来管理 Claude Code 和 Codex 的配置。

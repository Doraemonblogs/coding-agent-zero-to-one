---
verified: 2026-09-29
---

# 常见问题 FAQ

<PageMeta />

遇到问题时，先试试这三步，能解决大部分情况：

1. **关掉所有终端窗口，重新打开一个**再试；
2. 把报错信息**完整复制**下来，仔细看里面的关键词；
3. 运行诊断命令：`claude doctor` 或 `codex doctor`。

## 安装相关

### 命令找不到

**现象**：输入 `node`、`git`、`claude` 或 `codex` 时提示：
- Windows：`无法将"xxx"项识别为 cmdlet、函数、脚本文件或可运行程序的名称`
- macOS / Linux：`command not found: xxx`

**解决**：
1. 关掉**所有**终端窗口，重新打开一个再试。安装程序修改了系统的 PATH（程序搜索路径），已打开的窗口不会自动更新；
2. 还是不行，检查软件是否真的安装成功了：重新执行一遍安装命令，看有没有报错；
3. macOS / Linux 如果按 [避免权限错误](../01-environment/nodejs#macos-linux-专属-避免权限错误) 修改过 npm 全局目录，确认 `~/.zshrc`（或 `~/.bashrc`）里有 `export PATH="$HOME/.npm-global/bin:$PATH"` 这一行。

### Windows：禁止运行脚本

**现象**：`无法加载文件 ...\npm\claude.ps1，因为在此系统上禁止运行脚本`

**解决**：在 PowerShell 中执行，并输入 `Y` 确认：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### 运行 claude 报错 native binary not installed

**现象**：`npm install -g @anthropic-ai/claude-code` 显示安装成功，但运行 `claude` 时报错：

```text
Error: claude native binary not installed.
```

同时安装时可能出现 `npm warn install-scripts ... had install scripts blocked` 的提示。

**原因**：npm 12 默认拦截所有软件包的安装脚本，而 Claude Code 需要一个安装脚本来放置对应系统的程序文件。

**解决**：重新安装，并允许 Claude Code 运行安装脚本：

```bash
npm install -g @anthropic-ai/claude-code --allow-scripts=@anthropic-ai/claude-code
```

作者已用 npm 10、11、12 实测，这条命令都能正常安装。

### npm 安装很慢或失败

**现象**：`npm install` 卡住很久，或报 `ETIMEDOUT`、`ECONNRESET`。

**解决**：确认已经配置了国内镜像：

```bash
npm config get registry
```

应该输出 `https://registry.npmmirror.com`。如果不是，执行：

```bash
npm config set registry https://registry.npmmirror.com
```

### macOS / Linux：EACCES 权限错误

**现象**：`npm install -g` 时报 `EACCES: permission denied`。

**解决**：**不要**用 `sudo`。按 [避免权限错误](../01-environment/nodejs#macos-linux-专属-避免权限错误) 把 npm 全局目录改到用户目录。

### npm 提示 allow-scripts / install-scripts 警告

**现象**：`npm install` 结束时出现：

```
npm warn allow-scripts 1 package has install scripts not yet covered by allowScripts:
npm warn allow-scripts   esbuild@0.21.5 (postinstall: node install.js)
```

**原因**：这是 npm 新增的安全机制，防止恶意软件包在安装时偷偷执行代码。npm 11 的后期版本只是**提醒**（脚本照常运行），npm 12 会直接**拦截**（脚本不运行）。

**解决**：大多数情况**不需要处理**。以本教程的站点为例，被拦截的 esbuild 脚本只是做一次校验，拦截后站点照样能正常运行（作者已用 npm 12.1.0 实测）。

**例外是 Claude Code**：它必须运行安装脚本，否则无法使用，见上面的 [native binary not installed](#运行-claude-报错-native-binary-not-installed)。其他软件包确实需要放行时，按提示在安装命令后加上 `--allow-scripts=<包名>` 即可。

### 浏览器打开 localhost 显示"拒绝连接"

**现象**：终端里的程序已经正常启动，并显示了 `http://localhost:端口/` 这样的地址，但浏览器打开后显示"无法访问此网站""localhost 拒绝了我们的连接请求"（`ERR_CONNECTION_REFUSED`）。

**原因**：`localhost` 可以对应两个地址：IPv4 的 `127.0.0.1` 和 IPv6 的 `::1`。有些开发服务器只监听其中一个（在 Windows 上经常只监听 `::1`），而浏览器访问的是另一个，于是连不上。电脑上装了代理软件时更容易出现。

**解决**：
1. 先确认启动程序的那个终端窗口**还开着**，没有被关掉或按过 `Ctrl + C`；
2. 让程序明确监听 `127.0.0.1`。以 Vite 类的项目为例，启动时加上参数：`npm run dev -- --host 127.0.0.1`，然后用浏览器打开 `http://127.0.0.1:端口/`；
3. 用 `netstat -ano | findstr 端口号`（Windows）或 `lsof -i :端口号`（macOS）查看程序实际监听的地址，用那个地址访问。

::: tip 可以让 Agent 帮你处理
遇到这类问题，把终端输出和浏览器报错一起告诉 Claude Code 或 Codex，它通常能判断出原因并修改项目配置。
:::

### Node.js 版本太旧

**现象**：安装 Claude Code 时出现 `EBADENGINE` 警告，或 `node -v` 显示低于 `v22`。

**解决**：按 [安装 Node.js](../01-environment/nodejs) 重新安装 LTS 版本（目前是 v24）。

## 接入 DeepSeek 相关

### Claude Code 启动后还是要求登录

按 [跳过官方登录](../05-deepseek/claude-code#跳过官方登录) 操作。如果已经做过，检查 `~/.claude/settings.json` 的 JSON 格式是否正确。

### 报错 401 / Authentication Fails

API Key 不对。常见原因：
- 复制时少了几个字符，或者多了空格；
- 没有删掉占位符的尖括号 `< >`；
- Key 已经在 DeepSeek 平台上被删除了。

可以用 [验证 Key](../05-deepseek/#验证-key-可用) 的方法单独检查 Key。

### 报错 402 / Insufficient Balance

DeepSeek 账户余额不足，去 [开放平台](https://platform.deepseek.com/) 充值。

### 报错模型不存在

模型名写错了，或者 DeepSeek 更新了模型名。对照 [DeepSeek API 文档](https://api-docs.deepseek.com/zh-cn/) 修改配置里的模型名。

### Codex 报错 wire_api = "chat" is no longer supported

你参考了旧教程。新版 Codex 只支持 `wire_api = "responses"`，按 [Codex 接入 DeepSeek](../05-deepseek/codex) 的写法修改。

### 模型自称是 Claude / GPT

这是工具的系统提示词造成的，不代表没接入成功。看工具界面上显示的模型名，以及 DeepSeek 平台上的用量记录。

## 使用相关

### Claude Code 启动后直接退出了

第一次在某个文件夹里启动时，信任文件夹的询问**默认选中的是 `No, exit`**，直接按回车就会退出。按 `↓` 选中 `Yes, I trust this folder` 再回车。

### Agent 把代码改坏了

如果改之前用 Git 存过档：

```bash
git restore .
```

所有还没存档的修改都会被撤销。Agent 新建的文件需要手动删除。

Claude Code 还可以在输入框为空时连按两次 `Esc`，或输入 `/rewind`，把对话和代码一起回退到之前某一步。

### 对话越来越慢、越来越贵

对话越长，每次发给模型的内容越多。一个话题做完后开新对话：Claude Code 用 `/clear`，Codex 用 `/new`。对话必须继续但太长了，可以用 `/compact` 压缩。

---

没有找到你的问题？欢迎到 [GitHub Issues](https://github.com/doraemonblogs/coding-agent-zero-to-one/issues) 提问，附上你的**系统版本、执行的命令和完整报错信息**（记得把 API Key 打码）。

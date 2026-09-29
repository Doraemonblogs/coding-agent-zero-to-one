---
verified: 2026-09-29
time: 15 分钟
tested: partial
---

# 让终端走代理

<PageMeta />

这一节假设你已经有一个可用的代理客户端，并且**合法合规**地使用它。本教程不涉及代理服务的选择。

## 第 1 步：找到代理端口

打开代理客户端的设置页，找到**HTTP 端口**或**混合端口**（mixed port）。常见的端口号有 `7890`、`7897`、`10809` 等，**一定要以你自己客户端里显示的为准**。

下文统一用 `7890` 举例，你需要把它换成自己的端口号。

## 第 2 步：临时设置（只对当前窗口有效）

::: code-group
```powershell [Windows PowerShell]
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
$env:NO_PROXY = "localhost,127.0.0.1"
```

```bash [macOS / Linux]
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
export NO_PROXY="localhost,127.0.0.1"
# 有些程序只认小写的变量名，一起设上
export http_proxy="$HTTP_PROXY" https_proxy="$HTTPS_PROXY" no_proxy="$NO_PROXY"
```
:::

- `HTTP_PROXY` / `HTTPS_PROXY`：告诉程序通过哪个地址上网；
- `NO_PROXY`：哪些地址**不走**代理。本机地址（localhost、127.0.0.1）不应该走代理。

::: tip 地址里为什么是 http:// 开头
即使访问的是 https 网站，这里通常也写 `http://127.0.0.1:端口`。这表示"用 HTTP 协议和本地代理通信"，并不影响访问 https 网站的安全性。
:::

## 第 3 步：验证

::: code-group
```powershell [Windows PowerShell]
# 注意要写 curl.exe，PowerShell 里单写 curl 是另一个命令
curl.exe -I https://github.com
```

```bash [macOS / Linux]
curl -I https://github.com
```
:::

输出第一行类似 `HTTP/1.1 200 OK` 或 `HTTP/2 200`，说明终端已经能通过代理访问了。

如果输出 `Failed to connect to 127.0.0.1 port 7890`，说明端口号不对，或者代理客户端没开。

## 第 4 步（可选）：做成开关命令

每次都手动输入很麻烦。可以把设置写成两个"开关命令"：`proxy_on` 开启，`proxy_off` 关闭，以后在任何终端窗口里一敲就行。

::: code-group
```powershell [Windows PowerShell]
# 1. 打开 PowerShell 的配置文件（没有的话会先创建）
if (!(Test-Path $PROFILE)) { New-Item -Path $PROFILE -ItemType File -Force }
notepad $PROFILE

# 2. 在打开的记事本里粘贴下面的内容，把 7890 换成你的端口，保存并关闭
function proxy_on {
    $env:HTTP_PROXY = "http://127.0.0.1:7890"
    $env:HTTPS_PROXY = "http://127.0.0.1:7890"
    $env:NO_PROXY = "localhost,127.0.0.1"
    Write-Host "代理已开启"
}
function proxy_off {
    Remove-Item Env:HTTP_PROXY, Env:HTTPS_PROXY, Env:NO_PROXY -ErrorAction SilentlyContinue
    Write-Host "代理已关闭"
}

# 3. 重新打开终端，就可以使用 proxy_on / proxy_off 了
```

```bash [macOS / Linux]
# 1. 用文本编辑器打开 shell 配置文件（macOS 默认 zsh）
open -e ~/.zshrc        # macOS；如果提示文件不存在，先执行 touch ~/.zshrc
# nano ~/.bashrc        # Linux 用 bash 的话

# 2. 在文件末尾粘贴下面的内容，把 7890 换成你的端口，保存并关闭
proxy_on() {
  export HTTP_PROXY="http://127.0.0.1:7890" HTTPS_PROXY="http://127.0.0.1:7890"
  export NO_PROXY="localhost,127.0.0.1"
  export http_proxy="$HTTP_PROXY" https_proxy="$HTTPS_PROXY" no_proxy="$NO_PROXY"
  echo "代理已开启"
}
proxy_off() {
  unset HTTP_PROXY HTTPS_PROXY NO_PROXY http_proxy https_proxy no_proxy
  echo "代理已关闭"
}

# 3. 重新打开终端，就可以使用 proxy_on / proxy_off 了
```
:::

::: warning 待实测
Windows 下 `$PROFILE` 配置文件的写法作者没有在真实 Windows 机器上验证。如果重新打开终端后报"禁止运行脚本"，先完成 [允许 PowerShell 运行脚本](../01-environment/nodejs#windows-专属-允许-powershell-运行脚本) 这一步。
:::

::: tip 为什么不直接设成永久环境变量？
如果把代理写成永久环境变量，一旦代理客户端没开，终端里所有联网操作都会失败，而且不容易想到原因。做成"开关"，需要时才打开，更不容易出问题。
:::

## 各工具与代理的关系

| 工具 | 是否读取 `HTTPS_PROXY` 环境变量 | 备注 |
|---|---|---|
| git | 是 | 也可以用 `git config --global http.proxy` 单独设置，但要记得不用时取消 |
| npm | 是 | 用了国内镜像的话一般不需要代理 |
| curl | 是 | |
| Claude Code | 是 | |
| Codex | 是 | |

::: warning 代理开着时，访问国内服务反而可能变慢
设置了 `HTTPS_PROXY` 后，所有请求（包括 npmmirror、DeepSeek 这些国内服务）都会先经过代理客户端。代理客户端一般会按规则让国内网站直连，但如果你的客户端没有配置好分流规则，国内服务可能反而变慢。**不需要代理的时候，用 `proxy_off` 关掉。**
:::

## 常见报错

| 报错信息 | 可能原因 |
|---|---|
| `Failed to connect to 127.0.0.1 port xxxx` | 代理客户端没开，或端口号填错 |
| `ETIMEDOUT` / `Connection timed out` | 没有走代理（环境变量没设或不在同一个窗口），或者代理节点不可用 |
| `ECONNRESET` / `Connection reset` | 网络连接被中断，换个时间或检查代理节点 |
| `SSL certificate problem` | 某些代理或安全软件拦截了 HTTPS 流量，先试试关闭代理或安全软件 |

更多问题见 [常见问题](../faq/)。

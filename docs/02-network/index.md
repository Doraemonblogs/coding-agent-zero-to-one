---
verified: 2026-09-29
time: 10 分钟
---

# 第 2 章 · 什么时候需要代理

<PageMeta />

::: tip 先说结论
**本教程的主线不需要代理。** 用 npm 国内镜像安装工具、连接 DeepSeek，都可以在国内网络直接完成。这一章是**选读**，适合遇到网络问题、或者想弄明白代理原理的读者。
:::

## 合规说明

请遵守你所在地区的法律法规使用网络。本教程**不推荐、不提供任何代理服务或"机场"**，只讲解通用的网络原理和终端配置方法，帮助你理解和排查网络问题。

另外再次提醒：Anthropic 和 OpenAI 的官方服务不支持中国大陆等地区，在不支持的地区使用官方账号违反它们的服务条款（见 [第 0 章](../00-intro/#关于账号和费用-本教程的主线选择)）。

## 哪些场景可能用到代理

| 场景 | 本教程的处理方式 |
|---|---|
| 安装 Claude Code / Codex | 用 npm 国内镜像，**不需要** |
| 连接 DeepSeek | 国内服务，**不需要** |
| 从 GitHub 下载代码、Skill | GitHub 在国内有时能访问，有时很慢或失败，**视情况** |
| 使用两个工具的官方安装脚本 | 下载地址在海外，**可能需要**。本教程主线不用这个方式 |
| 阅读官方英文文档 | **视情况** |

## 代理的基本原理

如果你已经在用某个代理客户端，理解下面这张图就能解决大部分"浏览器能访问、终端却不行"的问题。

<svg viewBox="0 0 640 170" role="img" aria-label="浏览器通过系统代理设置、终端程序通过环境变量，把请求交给监听 127.0.0.1 端口的代理客户端，再由它转发到互联网" style="width:100%;max-width:640px;height:auto;font-family:var(--vp-font-family-base);margin:16px 0">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--vp-c-text-2)"/>
    </marker>
  </defs>
  <g font-size="14" fill="var(--vp-c-text-1)">
    <rect x="8" y="22" width="130" height="40" rx="8" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
    <text x="73" y="47" text-anchor="middle">浏览器</text>
    <rect x="8" y="108" width="130" height="40" rx="8" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
    <text x="73" y="133" text-anchor="middle">终端里的程序</text>
    <rect x="330" y="45" width="160" height="80" rx="8" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
    <text x="410" y="80" text-anchor="middle" font-weight="600">代理客户端</text>
    <text x="410" y="104" text-anchor="middle" font-size="12" fill="var(--vp-c-text-2)">监听 127.0.0.1:端口</text>
    <rect x="552" y="65" width="80" height="40" rx="8" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
    <text x="592" y="90" text-anchor="middle">互联网</text>
  </g>
  <g stroke="var(--vp-c-text-2)" stroke-width="1.5" fill="none" marker-end="url(#arrow)">
    <path d="M138,42 C230,42 250,70 328,70"/>
    <path d="M138,128 C230,128 250,100 328,100"/>
    <path d="M490,85 L550,85"/>
  </g>
  <g font-size="12" fill="var(--vp-c-text-2)" text-anchor="middle">
    <text x="232" y="30">读取「系统代理设置」</text>
    <text x="232" y="154">读取「环境变量」</text>
  </g>
</svg>

代理客户端在你的电脑上**监听一个本地端口**，比如 `127.0.0.1:7890`（`127.0.0.1` 代表"本机"）。其他程序把网络请求先交给这个端口，再由代理客户端转发出去。

问题在于：**不同的程序，获取代理地址的方式不一样。**

### 系统代理模式

大多数代理客户端默认开启"系统代理"，也就是修改操作系统的代理设置。**浏览器会读取这个设置**，所以浏览器能正常访问。

但是**终端里的大多数程序（git、npm、curl、Claude Code、Codex）不读系统代理设置**，它们读的是 `HTTP_PROXY`、`HTTPS_PROXY` 这两个**环境变量**。所以会出现"浏览器能打开 GitHub，终端里 `git clone` 却失败"的情况。

**解决方法**：在终端里设置这两个环境变量，下一节会讲具体操作。

### TUN 模式（虚拟网卡）

有些代理客户端提供"TUN 模式"或"虚拟网卡模式"。开启后，客户端会接管电脑上**所有程序**的网络流量，终端里的程序也不例外，**不需要**再设置环境变量。

代价是它影响整台电脑的网络，可能导致部分软件异常。遇到问题时，先关掉 TUN 模式试试。

### 一个常见误区

> "我开了代理，为什么终端还是连不上？"

请按顺序检查：
1. 代理客户端开着吗？
2. 如果没有开 TUN 模式，终端里设置 `HTTPS_PROXY` 环境变量了吗？
3. 环境变量里的**端口号**和代理客户端里显示的一致吗？
4. 设置环境变量**之后**，是在同一个终端窗口里运行的命令吗？（临时设置只对当前窗口有效）

下一步：[让终端走代理](./terminal-proxy)

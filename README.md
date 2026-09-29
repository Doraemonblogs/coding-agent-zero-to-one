# Coding Agent 从零到一

面向零基础用户的 **Claude Code / Codex** 中文入门教程：从安装基础环境开始，一步步做到接入 DeepSeek，并在自己的电脑上用 AI 写代码。

## 特点

- **真正从零开始**：默认你没用过终端，每个概念第一次出现时都会解释。
- **国内网络友好**：主线走「npm 国内镜像 + DeepSeek」，全程不需要代理。
- **两个工具都讲**：Claude Code 和 Codex CLI 并列讲解，配置文件给出可直接复制的模板。
- **标注验证状态**：每页标注最后验证的日期和工具版本，没能实测的步骤会明确标出「待实测」。

## 目录

| 章节 | 内容 | 状态 |
|---|---|---|
| [第 0 章 · 认识 Coding Agent](docs/00-intro/index.md) | 什么是 Coding Agent、学习路线图 | ✅ |
| [第 1 章 · 基础环境](docs/01-environment/index.md) | 终端、Git、Node.js 与 npm 镜像、VS Code | ✅ |
| [第 2 章 · 网络环境](docs/02-network/index.md) | 代理原理、让终端走代理（选读） | ✅ |
| [第 3 章 · Claude Code](docs/03-claude-code/index.md) | 安装、第一次上手 | ✅ |
| [第 4 章 · Codex CLI](docs/04-codex/index.md) | 安装、第一次上手 | ✅ |
| [第 5 章 · 接入 DeepSeek](docs/05-deepseek/index.md) | 申请 API Key，配置 Claude Code / Codex | ✅ |
| 第 6 章 · Skill | 安装和编写 Skill | 🚧 编写中 |
| 第 7 章 · 实战项目 | 从零完成一个小项目 | 🚧 编写中 |
| 第 8 章 · 方法与技巧 | 提需求、规划、Git、上下文、成本、安全 | 🚧 编写中 |
| [附录 · 配置模板](configs/) | 可直接复制的配置文件 | ✅ |
| [附录 · 常见问题](docs/faq/index.md) | 安装、接入、使用中的常见报错 | ✅ |

最短路径：[认识终端](docs/01-environment/terminal.md) → [安装 Node.js](docs/01-environment/nodejs.md) → [安装 Git](docs/01-environment/git.md) → [安装 Claude Code](docs/03-claude-code/index.md) → [接入 DeepSeek](docs/05-deepseek/claude-code.md) → [第一次上手](docs/03-claude-code/basics.md)

## 仓库结构

```
.
├── docs/            # 教程正文（VitePress 站点源文件）
│   ├── .vitepress/  # 站点配置
│   ├── 00-intro/ … 08-tips/
│   └── faq/
├── configs/         # 配置模板
└── package.json
```

## 本地预览

需要 Node.js 22 或更高版本。

```bash
npm install
npm run docs:dev
```

然后在浏览器中打开终端里显示的地址。

构建静态站点：

```bash
npm run docs:build
```

## 参与贡献

教程涉及的工具更新很快。如果你发现步骤过时、界面和描述不一致，或者某个「待实测」的步骤你已经验证过了，欢迎提交 Issue 或 Pull Request。提交时请注明你的**系统版本和工具版本**。

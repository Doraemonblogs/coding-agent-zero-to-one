import { defineConfig } from 'vitepress'

const repo = 'https://github.com/doraemonblogs/coding-agent-zero-to-one'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Coding Agent 从零到一',
  description: '面向零基础用户的 Claude Code / Codex 中文入门教程：环境配置、安装、接入 DeepSeek、Skill 与使用技巧',
  // 部署到 GitHub Pages 时仓库名即子路径
  base: '/coding-agent-zero-to-one/',
  cleanUrls: true,
  lastUpdated: true,

  markdown: {
    lineNumbers: false,
  },

  vite: {
    server: {
      // 默认监听 localhost 时，Windows 上可能只绑定到 IPv6 的 ::1，
      // 浏览器走 127.0.0.1 就会“拒绝连接”，所以明确监听 IPv4 回环地址
      host: '127.0.0.1',
    },
  },

  themeConfig: {
    nav: [
      { text: '开始学习', link: '/00-intro/' },
      { text: '配置模板', link: '/configs' },
      { text: '常见问题', link: '/faq/' },
    ],

    sidebar: [
      {
        text: '第 0 章 · 认识 Coding Agent',
        items: [
          { text: '什么是 Coding Agent', link: '/00-intro/' },
          { text: '学习路线图', link: '/00-intro/roadmap' },
        ],
      },
      {
        text: '第 1 章 · 基础环境',
        collapsed: false,
        items: [
          { text: '本章概览', link: '/01-environment/' },
          { text: '认识终端', link: '/01-environment/terminal' },
          { text: '安装 Git', link: '/01-environment/git' },
          { text: '安装 Node.js 与 npm 镜像', link: '/01-environment/nodejs' },
          { text: '安装 VS Code', link: '/01-environment/vscode' },
        ],
      },
      {
        text: '第 2 章 · 网络环境',
        items: [
          { text: '什么时候需要代理', link: '/02-network/' },
          { text: '让终端走代理', link: '/02-network/terminal-proxy' },
        ],
      },
      {
        text: '第 3 章 · Claude Code',
        items: [
          { text: '安装 Claude Code', link: '/03-claude-code/' },
          { text: '第一次上手', link: '/03-claude-code/basics' },
        ],
      },
      {
        text: '第 4 章 · Codex CLI',
        items: [
          { text: '安装 Codex CLI', link: '/04-codex/' },
          { text: '第一次上手', link: '/04-codex/basics' },
        ],
      },
      {
        text: '第 5 章 · 接入 DeepSeek',
        items: [
          { text: '准备 DeepSeek API Key', link: '/05-deepseek/' },
          { text: 'Claude Code 接入 DeepSeek', link: '/05-deepseek/claude-code' },
          { text: 'Codex 接入 DeepSeek', link: '/05-deepseek/codex' },
        ],
      },
      {
        text: '即将推出',
        collapsed: true,
        items: [
          { text: '第 6 章 · Skill', link: '/06-skills/' },
          { text: '第 7 章 · 实战项目', link: '/07-practice/' },
          { text: '第 8 章 · 方法与技巧', link: '/08-tips/' },
        ],
      },
      {
        text: '附录',
        items: [
          { text: '配置模板', link: '/configs' },
          { text: '常见问题 FAQ', link: '/faq/' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: repo }],

    editLink: {
      pattern: `${repo}/edit/main/docs/:path`,
      text: '在 GitHub 上编辑此页',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: { text: '最后更新' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    footer: {
      message: '内容会随工具更新而过时，每页顶部标注了最后验证的版本和日期。',
    },
  },
})

import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'

const repo = 'https://github.com/doraemonblogs/coding-agent-zero-to-one'
const base = '/coding-agent-zero-to-one/'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Coding Agent 从零到一',
  description: '面向零基础用户的 Claude Code / Codex 中文入门教程：环境配置、安装、接入 DeepSeek、Skill 与使用技巧',
  // 部署到 GitHub Pages 时仓库名即子路径
  base,
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#0b7a70' }],
  ],

  markdown: {
    lineNumbers: false,
    config(md) {
      // ::: steps —— 把其中的 ### 标题渲染成带编号的步骤时间线
      md.use(container, 'steps', {
        render: (tokens, idx) =>
          tokens[idx].nesting === 1 ? '<div class="cz-steps">\n' : '</div>\n',
      })
      // ::: terminal 标题 —— 给代码块套一个终端窗口外框，用来展示"你会看到"的输出
      md.use(container, 'terminal', {
        render: (tokens, idx) => {
          if (tokens[idx].nesting !== 1) return '</div>\n'
          const title = tokens[idx].info.trim().replace(/^terminal\s*/, '') || '终端'
          return (
            '<div class="cz-terminal"><div class="cz-terminal-bar"><i></i><i></i><i></i>' +
            `<span class="cz-terminal-title">${md.utils.escapeHtml(title)}</span></div>\n`
          )
        },
      })
    },
  },

  vite: {
    server: {
      // 默认监听 localhost 时，Windows 上可能只绑定到 IPv6 的 ::1，
      // 浏览器走 127.0.0.1 就会“拒绝连接”，所以明确监听 IPv4 回环地址
      host: '127.0.0.1',
    },
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '开始学习', link: '/00-intro/' },
      { text: '学习路线', link: '/00-intro/roadmap' },
      { text: '配置模板', link: '/configs' },
      { text: '常见问题', link: '/faq/' },
    ],

    sidebar: [
      {
        text: '第 0 章 · 认识 Coding Agent',
        collapsed: false,
        items: [
          { text: '什么是 Coding Agent', link: '/00-intro/' },
          { text: '学习路线图', link: '/00-intro/roadmap' },
        ],
      },
      {
        text: '第 1 章 · 基础环境',
        collapsed: true,
        items: [
          { text: '本章概览', link: '/01-environment/' },
          { text: '认识终端', link: '/01-environment/terminal' },
          { text: '安装 Git', link: '/01-environment/git' },
          { text: '安装 Node.js 与 npm 镜像', link: '/01-environment/nodejs' },
          { text: '安装 VS Code', link: '/01-environment/vscode' },
        ],
      },
      {
        text: '第 2 章 · 网络环境（选读）',
        collapsed: true,
        items: [
          { text: '什么时候需要代理', link: '/02-network/' },
          { text: '让终端走代理', link: '/02-network/terminal-proxy' },
        ],
      },
      {
        text: '第 3 章 · Claude Code',
        collapsed: true,
        items: [
          { text: '安装 Claude Code', link: '/03-claude-code/' },
          { text: '第一次上手', link: '/03-claude-code/basics' },
        ],
      },
      {
        text: '第 4 章 · Codex CLI',
        collapsed: true,
        items: [
          { text: '安装 Codex CLI', link: '/04-codex/' },
          { text: '第一次上手', link: '/04-codex/basics' },
        ],
      },
      {
        text: '第 5 章 · 接入 DeepSeek',
        collapsed: true,
        items: [
          { text: '准备 DeepSeek API Key', link: '/05-deepseek/' },
          { text: 'Claude Code 接入 DeepSeek', link: '/05-deepseek/claude-code' },
          { text: 'Codex 接入 DeepSeek', link: '/05-deepseek/codex' },
        ],
      },
      {
        text: '第 6 章 · Skill',
        collapsed: true,
        items: [
          { text: 'Skill 是什么', link: '/06-skills/' },
          { text: '安装现成的 Skill', link: '/06-skills/install' },
          { text: '编写自己的 Skill', link: '/06-skills/create' },
        ],
      },
      {
        text: '第 7 章 · 实战项目',
        collapsed: true,
        items: [
          { text: '项目介绍与准备', link: '/07-practice/' },
          { text: '先规划，再动手', link: '/07-practice/plan' },
          { text: '一步步实现', link: '/07-practice/build' },
          { text: '调试与收尾', link: '/07-practice/finish' },
        ],
      },
      {
        text: '第 8 章 · 方法与技巧',
        collapsed: true,
        items: [
          { text: '把需求说清楚', link: '/08-tips/' },
          { text: '靠谱的工作流程', link: '/08-tips/workflow' },
          { text: '上下文与费用', link: '/08-tips/context' },
          { text: '安全须知', link: '/08-tips/safety' },
        ],
      },
      {
        text: '附录',
        collapsed: false,
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

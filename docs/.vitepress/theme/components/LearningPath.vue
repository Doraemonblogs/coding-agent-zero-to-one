<script setup lang="ts">
import { withBase } from 'vitepress'

// inDoc：嵌在文档页里时去掉首页用的外边距和标题
defineProps<{ inDoc?: boolean }>()

type Chapter = {
  no: string
  title: string
  desc: string
  time: string
  link: string
  soon?: boolean
  optional?: boolean
}

const stages: { name: string; hint: string; chapters: Chapter[] }[] = [
  {
    name: '阶段一 · 打好地基',
    hint: '装好环境，学会用终端',
    chapters: [
      { no: '0', title: '认识 Coding Agent', desc: '它是什么、能做什么、本教程怎么学', time: '10 分钟', link: '/00-intro/' },
      { no: '1', title: '基础环境', desc: '终端、Git、Node.js、npm 镜像、VS Code', time: '40 分钟', link: '/01-environment/' },
      { no: '2', title: '网络环境', desc: '代理原理与终端代理配置，按需阅读', time: '15 分钟', link: '/02-network/', optional: true },
    ],
  },
  {
    name: '阶段二 · 跑起来',
    hint: '装上 Agent，接入 DeepSeek',
    chapters: [
      { no: '3', title: 'Claude Code', desc: '安装、第一次对话、权限模式、CLAUDE.md', time: '30 分钟', link: '/03-claude-code/' },
      { no: '4', title: 'Codex CLI', desc: '安装、沙箱与审批、AGENTS.md', time: '30 分钟', link: '/04-codex/' },
      { no: '5', title: '接入 DeepSeek', desc: '申请 API Key，两款工具分别配置', time: '20 分钟', link: '/05-deepseek/' },
    ],
  },
  {
    name: '阶段三 · 用得好',
    hint: '扩展能力，完成真实项目',
    chapters: [
      { no: '6', title: 'Skill', desc: '安装和编写"技能包"，让 Agent 更专业', time: '40 分钟', link: '/06-skills/' },
      { no: '7', title: '实战项目', desc: '从需求到上线，完整做一个小应用', time: '90 分钟', link: '/07-practice/' },
      { no: '8', title: '方法与技巧', desc: '提需求、控上下文、省钱与安全', time: '30 分钟', link: '/08-tips/' },
    ],
  },
]
</script>

<template>
  <section class="learning-path" :class="{ 'in-doc': inDoc }">
    <div class="container">
      <div v-if="!inDoc" class="head">
        <h2>学习路线</h2>
        <p>九章内容，分三个阶段。完成阶段二，你就能在自己的电脑上用 AI 写代码了。</p>
      </div>
      <div class="stages">
        <div v-for="(s, si) in stages" :key="s.name" class="stage">
          <div class="stage-head">
            <span class="stage-index">{{ si + 1 }}</span>
            <div>
              <div class="stage-name">{{ s.name }}</div>
              <div class="stage-hint">{{ s.hint }}</div>
            </div>
          </div>
          <a v-for="c in s.chapters" :key="c.no" class="card" :href="withBase(c.link)">
            <span class="no">{{ c.no }}</span>
            <span class="body">
              <span class="title">
                {{ c.title }}
                <span v-if="c.optional" class="tag">选读</span>
                <span v-if="c.soon" class="tag soon">即将推出</span>
              </span>
              <span class="desc">{{ c.desc }}</span>
              <span class="time">约 {{ c.time }}</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.learning-path {
  padding: 24px 24px 72px;
}

@media (min-width: 640px) {
  .learning-path { padding: 32px 48px 88px; }
}

@media (min-width: 960px) {
  .learning-path { padding: 40px 64px 96px; }
}

.learning-path.in-doc {
  padding: 0;
  margin: 24px 0 8px;
}

.learning-path.in-doc .stages {
  grid-template-columns: 1fr;
  margin-top: 0;
}

.learning-path.in-doc .card {
  text-decoration: none;
}

.container {
  max-width: 1152px;
  margin: 0 auto;
}

.head h2 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.head p {
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 15.5px;
}

.stages {
  display: grid;
  gap: 20px;
  margin-top: 28px;
}

@media (min-width: 960px) {
  .stages { grid-template-columns: repeat(3, 1fr); }
}

.stage {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border-radius: var(--cz-radius);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.stage-head {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 4px;
}

.stage-index {
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #fff;
  background: var(--cz-gradient);
}

.dark .stage-index { color: #06201d; }

.stage-name {
  font-weight: 700;
  font-size: 15.5px;
}

.stage-hint {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.card {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none !important;
  color: inherit;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--cz-card-shadow-hover);
}

.no {
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.title {
  font-weight: 700;
  font-size: 15px;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.desc {
  font-size: 13.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.time {
  margin-top: 2px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.tag {
  font-size: 11px;
  font-weight: 600;
  padding: 0 7px;
  line-height: 18px;
  border-radius: 999px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
}

.tag.soon {
  color: var(--cz-amber);
  background: var(--cz-amber-soft);
}
</style>

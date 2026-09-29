<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// 首页右侧的"终端演示"：逐行播放一段示意对话。
// 用户开启"减少动态效果"时直接显示全部内容。
type Line = { kind: 'cmd' | 'sys' | 'user' | 'ai' | 'tool' | 'ok' | 'blank'; text: string }

const script: Line[] = [
  { kind: 'cmd', text: 'cd ai-playground && claude' },
  { kind: 'sys', text: '✻ Claude Code · deepseek-v4-pro · ~/ai-playground' },
  { kind: 'blank', text: '' },
  { kind: 'user', text: '帮我做一个数字时钟网页，背景用柔和的渐变色' },
  { kind: 'ai', text: '好的，我来创建一个 index.html。' },
  { kind: 'tool', text: 'Write(index.html)' },
  { kind: 'ok', text: '已创建 index.html（48 行）' },
  { kind: 'ai', text: '完成！用浏览器打开 index.html 就能看到时钟。' },
]

const shown = ref<Line[]>([])
const typing = ref('')
const typingKind = ref<Line['kind'] | null>(null)
let timers: number[] = []
let cancelled = false

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    timers.push(window.setTimeout(resolve, ms))
  })

async function play() {
  while (!cancelled) {
    shown.value = []
    for (const line of script) {
      if (cancelled) return
      if (line.kind === 'cmd' || line.kind === 'user') {
        typingKind.value = line.kind
        typing.value = ''
        for (const ch of line.text) {
          if (cancelled) return
          typing.value += ch
          await wait(line.kind === 'cmd' ? 45 : 70)
        }
        await wait(350)
        typingKind.value = null
        shown.value.push(line)
        await wait(500)
      } else {
        shown.value.push(line)
        await wait(line.kind === 'blank' ? 100 : 650)
      }
    }
    await wait(4200)
  }
}

onMounted(() => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    shown.value = script
    return
  }
  play()
})

onBeforeUnmount(() => {
  cancelled = true
  timers.forEach((t) => clearTimeout(t))
  timers = []
})

const prefix: Record<Line['kind'], string> = {
  cmd: '$',
  sys: '',
  user: '❯',
  ai: '●',
  tool: '⎿',
  ok: '  ✓',
  blank: '',
}
</script>

<template>
  <div class="term-demo" aria-label="Claude Code 使用示意动画">
    <div class="bar">
      <i /><i /><i />
      <span class="title">终端 — ai-playground</span>
    </div>
    <div class="body">
      <div v-for="(l, i) in shown" :key="i" class="line" :class="l.kind">
        <span v-if="prefix[l.kind]" class="p">{{ prefix[l.kind] }}</span>
        <span>{{ l.text }}</span>
      </div>
      <div v-if="typingKind" class="line" :class="typingKind">
        <span class="p">{{ prefix[typingKind] }}</span>
        <span>{{ typing }}</span><span class="caret" />
      </div>
      <div v-else class="line idle"><span class="caret" /></div>
    </div>
    <div class="caption">示意动画，实际界面以你的终端为准</div>
  </div>
</template>

<style scoped>
.term-demo {
  width: min(100%, 460px);
  border-radius: 14px;
  overflow: hidden;
  background: var(--cz-term-bg);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow:
    0 30px 60px -25px rgba(2, 6, 23, 0.55),
    0 0 0 1px rgba(45, 212, 191, 0.06);
  font-family: var(--vp-font-family-mono);
  text-align: left;
}

.bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  background: var(--cz-term-bar);
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.bar i {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.bar i:nth-child(1) { background: #f87171; }
.bar i:nth-child(2) { background: #fbbf24; }
.bar i:nth-child(3) { background: #4ade80; }

.title {
  margin-left: 8px;
  font-size: 12px;
  color: var(--cz-term-dim);
}

.body {
  min-height: 250px;
  padding: 16px 18px 18px;
  font-size: 13px;
  line-height: 1.75;
  color: var(--cz-term-text);
}

.line {
  display: flex;
  gap: 8px;
  white-space: pre-wrap;
  word-break: break-all;
}

.line.blank {
  height: 8px;
}

.p {
  flex: none;
  color: var(--cz-term-dim);
}

.line.cmd .p { color: var(--cz-term-green); }
.line.sys { color: var(--cz-term-dim); }
.line.user { color: #fff; }
.line.user .p { color: var(--cz-term-teal); }
.line.ai .p { color: var(--cz-term-teal); }
.line.tool { color: var(--cz-term-blue); padding-left: 16px; }
.line.tool .p { color: var(--cz-term-dim); }
.line.ok { color: var(--cz-term-green); padding-left: 16px; }
.line.ok .p { color: var(--cz-term-green); }

.caret {
  display: inline-block;
  width: 8px;
  height: 16px;
  margin-top: 3px;
  background: var(--cz-term-teal);
  animation: blink 1s steps(1) infinite;
}

.line.idle {
  padding-left: 0;
}

@keyframes blink {
  50% { opacity: 0; }
}

.caption {
  padding: 8px 18px 10px;
  font-family: var(--vp-font-family-base);
  font-size: 12px;
  color: var(--cz-term-dim);
  border-top: 1px solid rgba(148, 163, 184, 0.12);
}

@media (prefers-reduced-motion: reduce) {
  .caret { animation: none; }
}
</style>

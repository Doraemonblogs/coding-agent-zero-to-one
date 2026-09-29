<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

// 从页面 frontmatter 读取元信息，显示在标题下方：
// verified: 最后验证日期；versions: 涉及的工具版本；time: 预计用时；
// tested: full（已实测）/ partial（部分待实测）/ none（待实测）
const { frontmatter } = useData()

const testedLabel = computed(() => {
  switch (frontmatter.value.tested) {
    case 'full':
      return { text: '已实测', cls: 'ok' }
    case 'partial':
      return { text: '部分待实测', cls: 'partial' }
    case 'none':
      return { text: '待实测', cls: 'pending' }
    default:
      return null
  }
})

// YAML 会把 2026-09-29 解析成日期对象，这里统一格式化成 YYYY-MM-DD
const verified = computed(() => {
  const v = frontmatter.value.verified
  if (!v) return ''
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return String(v).slice(0, 10)
})

const versions = computed<string[]>(() => {
  const v = frontmatter.value.versions
  return Array.isArray(v) ? v : v ? [v] : []
})
</script>

<template>
  <div class="page-meta" v-if="verified || frontmatter.time || versions.length">
    <span v-if="frontmatter.time" class="pill">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
      预计 {{ frontmatter.time }}
    </span>
    <span v-if="verified" class="pill">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
      最后验证 {{ verified }}
    </span>
    <span v-for="v in versions" :key="v" class="pill mono">{{ v }}</span>
    <span v-if="testedLabel" class="pill status" :class="testedLabel.cls">{{ testedLabel.text }}</span>
  </div>
</template>

<style scoped>
.page-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 28px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 11px;
  font-size: 12.5px;
  line-height: 22px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
}

.pill svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.pill.mono {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}

.pill.status.ok {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-color: transparent;
}

.pill.status.partial,
.pill.status.pending {
  color: var(--cz-amber);
  background: var(--cz-amber-soft);
  border-color: transparent;
}
</style>

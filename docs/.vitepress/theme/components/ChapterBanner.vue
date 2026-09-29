<script setup lang="ts">
import { useData, withBase } from 'vitepress'

// 章节首页顶部的插图：在页面 frontmatter 里写 banner: /images/banners/chN.webp
const { frontmatter } = useData()
</script>

<template>
  <figure v-if="frontmatter.banner" class="chapter-banner">
    <img :src="withBase(frontmatter.banner)" alt="" width="1440" height="655" />
  </figure>
</template>

<style scoped>
.chapter-banner {
  margin: 0 0 28px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  aspect-ratio: 1440 / 655;
  background: var(--vp-c-bg-soft);
}

.chapter-banner img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dark .chapter-banner img {
  filter: brightness(0.86) saturate(0.95);
}
</style>

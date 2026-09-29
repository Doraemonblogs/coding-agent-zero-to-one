import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import PageMeta from './components/PageMeta.vue'
import TerminalDemo from './components/TerminalDemo.vue'
import LearningPath from './components/LearningPath.vue'
import ChapterBanner from './components/ChapterBanner.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(TerminalDemo),
      'home-features-after': () => h(LearningPath),
      'doc-before': () => h(ChapterBanner),
    }),
  enhanceApp({ app }) {
    app.component('PageMeta', PageMeta)
    app.component('LearningPath', LearningPath)
  },
} satisfies Theme

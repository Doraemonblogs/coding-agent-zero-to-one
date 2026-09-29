---
verified: 2026-09-29
versions: [Claude Code 2.1.284, Codex CLI 0.158.0]
time: 40 分钟
tested: partial
---

# 一步步实现

<PageMeta />

有了 `PLAN.md`，接下来按阶段实现。每个阶段都走同一个循环：

<figure class="cz-figure">
<svg viewBox="0 0 680 120" role="img" aria-label="每个阶段的循环：提需求，Agent 实现，你在浏览器里验收，检查代码改动，用 Skill 提交，然后进入下一阶段" style="width:100%;height:auto;font-family:var(--vp-font-family-base)">
  <defs>
    <marker id="build-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--vp-c-text-3)"/>
    </marker>
  </defs>
  <g font-size="14" text-anchor="middle" fill="var(--vp-c-text-1)">
    <rect x="6" y="30" width="112" height="52" rx="12" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
    <text x="62" y="54" font-weight="600">① 提需求</text>
    <text x="62" y="72" font-size="11.5" fill="var(--vp-c-text-2)">只说这一阶段</text>
    <rect x="144" y="30" width="112" height="52" rx="12" fill="var(--vp-c-brand-soft)" stroke="var(--vp-c-brand-1)"/>
    <text x="200" y="54" font-weight="600">② Agent 实现</text>
    <text x="200" y="72" font-size="11.5" fill="var(--vp-c-text-2)">你批准每次修改</text>
    <rect x="282" y="30" width="112" height="52" rx="12" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
    <text x="338" y="54" font-weight="600">③ 浏览器验收</text>
    <text x="338" y="72" font-size="11.5" fill="var(--vp-c-text-2)">亲手点一遍</text>
    <rect x="420" y="30" width="112" height="52" rx="12" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
    <text x="476" y="54" font-weight="600">④ 看改动</text>
    <text x="476" y="72" font-size="11.5" fill="var(--vp-c-text-2)">源代码管理面板</text>
    <rect x="558" y="30" width="116" height="52" rx="12" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
    <text x="616" y="54" font-weight="600">⑤ 提交存档</text>
    <text x="616" y="72" font-size="11.5" fill="var(--vp-c-text-2)">用 zh-commit</text>
  </g>
  <g stroke="var(--vp-c-text-3)" stroke-width="1.5" fill="none" marker-end="url(#build-arrow)">
    <path d="M118,56 L142,56"/><path d="M256,56 L280,56"/><path d="M394,56 L418,56"/><path d="M532,56 L556,56"/>
    <path d="M616,82 C616,112 62,112 62,84"/>
  </g>
  <text x="340" y="112" font-size="11.5" text-anchor="middle" fill="var(--vp-c-text-2)" style="paint-order:stroke" stroke="var(--vp-c-bg)" stroke-width="6">下一阶段</text>
</svg>
<figcaption>每个阶段：提需求 → 实现 → 验收 → 看改动 → 提交</figcaption>
</figure>

::: tip 在浏览器里打开项目
第一个阶段完成后，在文件管理器里双击 `index.html`，用浏览器打开它，**这个窗口不用关**。以后每次 Agent 改完，在浏览器里按 <kbd>F5</kbd>（macOS：<kbd>Command</kbd> + <kbd>R</kbd>）刷新就能看到最新效果。
:::

::::: steps

### 阶段 1：页面骨架 + 记一笔

```text
按 PLAN.md 做阶段 1：页面骨架和「记一笔」表单，包括金额校验。
做完停下来，告诉我怎么验收。
```

Agent 会创建 `index.html`、`style.css`、`app.js`。在 Manual 模式下，每个文件创建前都会问你，可以先看一眼内容再批准。

**验收**：在浏览器里打开 `index.html`，逐项检查：

- ☐ 能看到"记一笔"表单，可以切换收入 / 支出，分类选项跟着变
- ☐ 日期默认是今天
- ☐ 金额填 `abc`、`0`、`-5`、`12.345`，点添加，都会提示错误
- ☐ 金额填 `32.5`，点添加，没有报错

**看改动 + 提交**：在 VS Code 的源代码管理面板里浏览一遍新增的代码（不需要全看懂，大致知道每个文件做什么就行），然后：

::: code-group
```text [Claude Code]
/zh-commit
```

```text [Codex]
$zh-commit
```
:::

### 阶段 2：明细列表 + 删除 + 本地保存

```text
阶段 1 验收通过。继续做阶段 2：明细列表、删除、保存到 localStorage。
做完停下来，告诉我怎么验收。
```

**验收**：

- ☐ 添加几条记录，明细里按日期分组显示，新的在上面
- ☐ 备注填 `<b>午饭</b>`，显示的是原样文字，不是粗体
- ☐ 点删除会先弹出确认，确认后记录消失
- ☐ **刷新页面**，记录还在；关掉浏览器再打开，记录还在

验收通过后提交。

### 阶段 3：汇总 + 分类占比 + 切换月份

```text
阶段 2 验收通过。继续做阶段 3：本月汇总、支出分类占比、切换月份。
做完停下来，告诉我怎么验收。
```

**验收**：

- ☐ 顶部显示本月收入、支出、结余，数字和明细对得上（可以自己算一下）
- ☐ 分类占比的百分比从高到低排列，加起来约等于 100%
- ☐ 点"上个月"，数据变成空的；点"下个月"回来，数据恢复
- ☐ 添加一条日期是上个月的记录，页面会自动跳到上个月并显示它

验收通过后提交。

### 阶段 4：手机适配和细节打磨

```text
阶段 3 验收通过。继续做阶段 4：检查手机上的显示效果，
按 beginner-web 的检查清单逐项检查一遍，把发现的问题修好。
```

这一步 Agent 应该会去读 `beginner-web` 附带的检查清单（Skill 的第 3 层按需加载）。

**验收**：用浏览器的"手机模式"查看效果：

1. 在浏览器里按 <kbd>F12</kbd> 打开开发者工具（macOS：<kbd>Command</kbd> + <kbd>Option</kbd> + <kbd>I</kbd>）；
2. 按 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd>（macOS：<kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd>）切换到手机模式；
3. 在顶部选择一个手机型号，比如 iPhone 12 Pro。

- ☐ 页面没有横向滚动条，左右拖不动
- ☐ 按钮大小方便手指点击，文字不会太小
- ☐ 输入框、下拉框都能正常使用

验收通过后提交。

:::::

::: tip 作者实测的一个真实问题
作者在编写参考成品时就遇到过：手机宽度下，**日期输入框把整个页面撑宽**，出现了横向滚动条。原因是浏览器给日期输入框设置了默认的最小宽度。修复方法是在 CSS 里把两列布局写成 `minmax(0, 1fr)`。

如果你也遇到类似问题，可以这样告诉 Agent："手机模式下页面可以左右拖动，好像是某个元素太宽了，帮我找出是哪个元素并修复。"
:::

## 做得不满意怎么办

| 情况 | 做法 |
|---|---|
| 刚开始改，发现方向不对 | 立即按 <kbd>Esc</kbd> 打断，重新说清楚要求 |
| 改完了，但效果不对 | 具体描述哪里不对（见下一节），让它修改 |
| 改乱了，想回到上次提交 | 让 Agent 执行，或自己执行 `git restore .`，新建的文件手动删除 |
| Claude Code 里想撤回最近几步 | 输入框为空时按 <kbd>Esc</kbd> <kbd>Esc</kbd>，或输入 `/rewind`，选择回到哪一步 |
| 对话太长，Agent 开始"犯糊涂" | 先提交，然后 `/clear`（Codex 用 `/new`）开新对话，说"读一下 PLAN.md，继续做下一个阶段" |

::: tip 为什么每个阶段都要提交
提交就是存档。某个阶段做坏了，最多回退到上一个阶段，前面的成果都在。**阶段越小、提交越勤，越不怕出错。**
:::

下一步：[调试与收尾](./finish)

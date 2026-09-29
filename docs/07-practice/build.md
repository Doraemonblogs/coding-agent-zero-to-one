---
verified: 2026-09-29
versions: [Claude Code 2.1.284, Codex CLI 0.158.0]
time: 40 分钟
tested: full
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

::: info 下面以作者的实测为例
作者用 Claude Code + DeepSeek 按本页做了一遍（完整记录见 [RUN-LOG.md](https://github.com/doraemonblogs/coding-agent-zero-to-one/blob/main/examples/xiaozhangben/RUN-LOG.md)）。**你的 PLAN.md 分阶段的方式可能和作者的不一样，以你自己的 PLAN.md 为准**——这正是让 Agent 先写计划的好处：每个阶段做什么，文件里都写着。
:::

::::: steps

### 阶段 1

```text
按 PLAN.md 做阶段 1。做完停下来，告诉我怎么验收。
```

不需要重复阶段 1 的具体内容，PLAN.md 里都有。在 Manual 模式下，每个文件创建前都会问你，可以先看一眼内容再批准。

作者实测，阶段 1 是"页面骨架"，用时 1.5 分钟。Agent 做完后是这样交代的：

::: terminal 你会看到（作者实测，节选）
```text
阶段 1 完成。这次做了什么：

- index.html：整页结构，从上到下是标题 → 月份切换器 → 三个汇总卡片 → 「记一笔」表单
  （收支类型、金额、分类、日期、备注）→ 支出分类占比（两条示例横条）→ 明细列表（一组示例）
- style.css：移动优先样式，手机单列、电脑居中加宽，按钮有悬停/按下变色反馈，收入绿、支出红
- app.js：先放了一个空文件占位，防止打开页面时浏览器报"找不到文件"
- PLAN.md：阶段 1 的三项已勾选，进度记录已更新

怎么验收（重点看这三样）：
1. 版面完整：上面说的七个区块都在……
2. 手机宽度：按 F12 打开开发者工具 → 点左上角「设备模拟」图标（手机形状）→ 宽度选 375px，
   确认页面左右拖不动、没有横向滚动条
3. 电脑宽屏：把浏览器窗口拉宽，内容会居中显示、不会铺满整屏

注意：现在所有按钮点了都没反应，这是正常的——记账、删除、切月这些功能阶段 2、3 才会实现。
```
:::

**照着它给的验收步骤，自己在浏览器里点一遍。** 没问题的话：

**看改动 + 提交**：在 VS Code 的源代码管理面板里浏览一遍新增的代码（不需要全看懂，大致知道每个文件做什么就行），然后：

::: code-group
```text [Claude Code]
/zh-commit
```

```text [Codex]
$zh-commit
```
:::

::: terminal 你会看到（作者实测）
```text
已提交，最新提交是 82ea849 新功能：小账本页面骨架（阶段 1），包含 4 个文件的改动：

- 新增 index.html（页面结构）、style.css（样式）、app.js（空占位）
- 更新 PLAN.md（勾选阶段 1、记进度）

安全检查已做：没有敏感信息混入。阶段 1 存档完毕，随时可以开始阶段 2。
```
:::

### 阶段 2

```text
阶段 1 验收通过，已经提交。继续按 PLAN.md 做阶段 2。做完停下来，告诉我怎么验收。
```

作者实测，阶段 2 是"核心记账闭环"（记一笔、汇总、明细、删除、本地保存），用时 2 分钟。它给出的验收步骤写得非常具体：

::: terminal 你会看到（作者实测，节选）
```text
怎么验收（刷新一下 index.html，然后按顺序试）：

1. 记一笔：类型选支出 → 金额填 12.34 → 分类选餐饮 → 备注填 午饭 → 点「记一笔」。
   上面三个卡片里总支出变成 ¥12.34、结余变成 -¥12.34，明细出现一条记录
2. 记收入：点「收入」按钮（注意分类下拉变了）→ 金额 5000 → 工资 → 记一笔。
   总收入 ¥5000.00，结余 ¥4987.66
3. 试错误金额：分别输入 0、-5、abc、12.345，每次点「记一笔」都应看到红色错误提示，
   且明细和汇总都不变
4. 删除：点明细里某条的「删除」→ 浏览器弹窗问「确定删除这条记录吗？」→ 点确定后记录消失
5. 刷新不丢：按 F5 刷新页面，记的记录还在
6. 顺手试一下：备注填 <b>测试</b>，明细里应该原样显示这串字符，不会变粗体
```
:::

注意第 2 条：它连"结余应该是 ¥4987.66"都算好了，你只要对照着看就行。**如果它给的验收步骤太笼统，就追问一句"具体要怎么点、应该看到什么"。**

验收通过后提交。

### 阶段 3

```text
阶段 2 验收通过，已经提交。继续按 PLAN.md 做阶段 3。做完停下来，告诉我怎么验收。
```

作者实测，阶段 3 是"分类占比 + 切换月份"，用时 1.5 分钟。验收时重点看：

- ☐ 记三笔支出：餐饮 30、交通 20、学习 50，占比从上到下是学习 50%、餐饮 30%、交通 20%
- ☐ 再记一笔收入，占比图不变（收入不参与）
- ☐ 点"上月"，汇总归零、明细为空；点"下月"回来，数据恢复
- ☐ 从 2026 年 1 月再点"上月"，变成 2025 年 12 月（跨年）

验收通过后提交。

### 阶段 4：按检查清单收尾

```text
阶段 3 验收通过，已经提交。继续按 PLAN.md 做阶段 4，按 beginner-web 的检查清单逐项检查一遍，把发现的问题修好。做完停下来，告诉我结果。
```

这一步 Agent 会去读 `beginner-web` 附带的检查清单（Skill 的第 3 层按需加载）。作者实测，它逐项检查后，**自己发现并修好了一个 bug**：

::: terminal 你会看到（作者实测，节选）
```text
发现并修复了 1 个问题 🐛
- 日期框被手动清空后点「记一笔」，会存进一条任何月份都看不到的"幽灵记录"。
  已修复：日期为空时提示「请选择日期」，不添加记录

验收标准逐条对应：金额校验（测试全过）✅；备注防 XSS（代码审查确认所有用户输入走
textContent，<b> 只会原样显示）✅；375px（布局审查通过）✅

你最后在本机确认两件事
1. 备注：记一笔，备注填 <b>测试</b>，明细里应一字不差显示，不是粗体
2. 375px：F12 → 设备模拟选 iPhone SE（375px），左右拖不动即可
```
:::

::: warning Agent 看不到你的浏览器
注意它的措辞："布局**审查**通过"、"请你在本机确认"。Agent 只是**读代码**判断手机上不会有横向滚动条，它并没有真的在浏览器里看过。**界面上的效果，一定要自己打开浏览器确认。**
:::

**验收**：用浏览器的"手机模式"查看效果：

1. 在浏览器里按 <kbd>F12</kbd> 打开开发者工具（macOS：<kbd>Command</kbd> + <kbd>Option</kbd> + <kbd>I</kbd>）；
2. 按 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd>（macOS：<kbd>Command</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd>）切换到手机模式；
3. 在顶部选择一个手机型号，比如 iPhone SE（宽度 375px）。

- ☐ 页面没有横向滚动条，左右拖不动
- ☐ 按钮大小方便手指点击，文字不会太小
- ☐ 输入框、下拉框都能正常使用
- ☐ 备注 `<b>测试</b>` 原样显示

验收通过后提交。

:::::

::: tip 手机上页面被撑宽？
作者在另一次测试中遇到过：手机宽度下，**日期输入框把整个页面撑宽**，出现了横向滚动条。原因是浏览器给日期输入框设置了默认的最小宽度，修复方法是在 CSS 里把两列布局写成 `minmax(0, 1fr)`。

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

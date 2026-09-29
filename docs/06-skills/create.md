---
verified: 2026-09-29
versions: [Claude Code 2.1.284, Codex CLI 0.158.0]
time: 25 分钟
tested: full
---

# 编写自己的 Skill

<PageMeta />

::: info 验证情况
- ✅ 已实测：本页的两个示例 Skill 放入对应目录后，Claude Code 的 `/skills` 能列出它们，Codex 能读取到它们的名称和描述
- ✅ 已实测（接 DeepSeek）：Claude Code 和 Codex 都能**自动触发**和**点名调用**这两个 Skill；`beginner-web` 的检查清单也会被按需读取。页面里的对话内容都来自实测
:::

## 什么时候该写一个 Skill

出现下面这些情况时，就值得写一个 Skill：

- 同一段要求，你已经**复制粘贴给 Agent 好几次**了；
- 某件事有**固定的步骤**，每次都要提醒 Agent 别漏掉（比如提交代码前检查有没有密钥）；
- 你有一些**专门的知识或规范**，Agent 默认不知道（比如你们团队的代码风格）；
- `CLAUDE.md` / `AGENTS.md` 越写越长，其中一部分只在特定任务时才用得上。

## 动手：写一个「中文提交」Skill

我们来写一个 Skill，让 Agent 提交代码时：先检查有没有误提交密钥，再用规范的中文写提交说明。

::::: steps

### 创建 Skill 文件夹

Skill 文件夹的名字就是 Skill 的名字，用**小写英文字母、数字和短横线**。

::: code-group
```powershell [Windows · Claude Code]
New-Item -ItemType Directory -Force "$HOME\.claude\skills\zh-commit" | Out-Null
code "$HOME\.claude\skills\zh-commit\SKILL.md"
```

```powershell [Windows · Codex]
New-Item -ItemType Directory -Force "$HOME\.agents\skills\zh-commit" | Out-Null
code "$HOME\.agents\skills\zh-commit\SKILL.md"
```

```bash [macOS / Linux · Claude Code]
mkdir -p ~/.claude/skills/zh-commit
code ~/.claude/skills/zh-commit/SKILL.md
```

```bash [macOS / Linux · Codex]
mkdir -p ~/.agents/skills/zh-commit
code ~/.agents/skills/zh-commit/SKILL.md
```
:::

### 写 SKILL.md

把下面的内容复制进去，保存：

<<< @/../skills/zh-commit/SKILL.md

这个文件也可以在本教程仓库的 [`skills/zh-commit/`](https://github.com/doraemonblogs/coding-agent-zero-to-one/tree/main/skills/zh-commit) 目录里找到。

::: warning 开头的 --- 必须在第一行
`---` 必须是文件的**第一行**，前面不能有空行或其他内容，否则工具读不到 `name` 和 `description`。Codex 在读不到 `description` 时会直接忽略这个 Skill。
:::

### 确认工具识别了它

启动 Claude Code 或 Codex（已经在运行的 Claude Code 可以输入 `/reload-skills`），输入 `/skills`，列表里应该能看到 `zh-commit`。

::: terminal Claude Code 中你会看到（作者实测）
```text
 Skills
 2 skills · enter/space to cycle, / to search, t to sort, Esc to close

 ❯ ✔ beginner-web   user · ~30 tok
   ✔ zh-commit      user · ~30 tok
```
:::

### 测试：让它自动触发

在一个有改动的 Git 项目里，正常地说：

```text
帮我提交一下
```

因为"提交一下"出现在 `description` 里，Agent 会自动使用 `zh-commit`：

::: terminal Claude Code 中你会看到（作者实测，节选）
```text
❯ 帮我提交一下

● Skill(zh-commit)
  ⎿  Successfully loaded skill

  Thought for 9s, ran 2 shell commands

● 改动看完了：是一个新的数字时钟网页（原生 HTML/CSS/JS，无密钥等敏感内容）。提交说明如下：

  新功能：数字时钟页面显示时间和日期

  - 新增 index.html 页面结构，上方大号时间、下方小字日期
  ……

● 提交完成 ✅
  c04505e 新功能：数字时钟页面显示时间和日期
```
:::

- `Skill(zh-commit)` 和 `Successfully loaded skill`：它翻开了这本"手册"；
- "无密钥等敏感内容"：它按 Skill 里的第 2 步做了安全检查；
- 提交说明的格式（`新功能：` 开头、下面列要点）也正是 Skill 里规定的。

### 测试：点名调用

::: code-group
```text [Claude Code]
/zh-commit
```

```text [Codex]
$zh-commit
```
:::

在 Claude Code 里输入 `/zh` 就会弹出候选，显示 Skill 的名字和 `description`；在 Codex 里输入 `$` 也会弹出 Skill 列表：

::: terminal Codex 中你会看到（作者实测）
```text
› zh-commit  [Skill] 检查当前的代码改动，用简体中文写一条清晰的 Git 提交说明并提交。当用户说"提交一…
  enter insert · esc close
```
:::

按 <kbd>Enter</kbd> 把它插入输入框，再按 <kbd>Enter</kbd> 发送。Codex 回复"我来按中文提交规范检查改动并提交。"，然后依次执行了 `git status`、`git diff --stat`，最后请求批准提交（为什么要批准，见 [Codex 第一次上手 · 存档](../04-codex/basics#存档)）。

:::::

## 进阶：带辅助文件的 Skill

第二个示例 `beginner-web` 是一份"新手网页项目规范"，它还附带了一份检查清单，演示 Skill 的**第 3 层按需加载**：

```text
beginner-web/
├── SKILL.md                  ← 规范正文
└── reference/
    └── checklist.md          ← 检查清单，完成功能前才读
```

`SKILL.md` 的最后一行这样引用它：

```markdown
## 完成一个功能前

对照 [reference/checklist.md](reference/checklist.md) 做一遍检查。
```

平时 Agent 只读 `SKILL.md`；只有需要做检查时，才会去打开 `checklist.md`。作者实测，两个工具都是这样做的：

::: code-group
```text [Claude Code（作者实测）]
● Skill(beginner-web)
  ⎿  Successfully loaded skill

  Thinking for 3s, reading 1 file…
  ⎿  ~/.claude/skills/beginner-web/reference/checklist.md
```

```text [Codex（作者实测）]
• Explored
  └ Read SKILL.md (beginner-web skill)
    List ls -la
    Read checklist.md
```
:::

::: tip Claude Code 读 Skill 的附带文件时可能会问你
`checklist.md` 在用户目录里，不在当前项目文件夹内。Manual 模式下，Claude Code 读取项目**以外**的文件时会先问你（`Do you want to proceed?`），选第 2 项 `Yes, allow reading from ...beginner-web/reference during this session` 即可，这次会话里就不会再问了。
:::

::: details 查看 beginner-web 的完整内容
<<< @/../skills/beginner-web/SKILL.md

<<< @/../skills/beginner-web/reference/checklist.md
:::

第 7 章的实战项目会用到这个 Skill。

## 放在用户目录，还是放在项目里？

| 放在哪里 | Claude Code | Codex | 适合 |
|---|---|---|---|
| **用户目录** | `~/.claude/skills/` | `~/.agents/skills/` | 个人习惯，所有项目都用（如 `zh-commit`） |
| **项目目录** | `项目/.claude/skills/` | `项目/.agents/skills/` | 这个项目专用的规范，**提交到 Git 后，协作者也能用** |

比如第 7 章的项目，我们会把 `beginner-web` 放进项目的 `.claude/skills/` 和 `.agents/skills/`，这样项目本身就带着自己的规范。

## 写好 description：让 Agent 在对的时候想起它

Agent 平时只能看到每个 Skill 的名称和描述，**description 写得好不好，决定了 Skill 能不能被用上**。

| ❌ 不好的写法 | ✅ 好的写法 |
|---|---|
| `提交代码` | `检查当前的代码改动，用简体中文写一条清晰的 Git 提交说明并提交。当用户说"提交一下""存个档""保存进度"时使用。` |
| `网页规范` | `为编程新手制作网页小项目的规范……在创建或修改网页、小工具、单页应用时使用。` |

要点：
1. **先说做什么**，再说**什么时候用**；
2. 写上用户可能会说的**触发词**，比如"提交一下""存个档"；
3. 具体，不要泛泛而谈；
4. 控制长度：Codex 限制在 1024 个字符以内，Claude Code 在列表中会截断过长的描述。

## 写好正文的几个原则

- **用命令式、分步骤地写**："运行 `git status`"，而不是"可以考虑查看一下状态"；
- **给出示例**：一个具体的输出示例，比十句描述更有用；
- **写清楚边界情况**：比如"如果没有改动，就告诉用户并停止"；
- **保持简短**：正文建议控制在 500 行以内，详细的参考资料拆到辅助文件里；
- **只写模型不知道的**：通用的编程常识不用写，写你的特殊要求。

## 让 Agent 帮你写 Skill

最省事的方法：先和 Agent 一起把某件事做一遍，做得满意之后，让它把过程总结成 Skill。

```text
我们刚才整理发布说明的流程很好。帮我把它写成一个 Skill，
放到 ~/.claude/skills/release-notes/SKILL.md。
description 要写清楚做什么和什么时候用，正文用分步骤的写法。
```

工具也提供了专门写 Skill 的 Skill：
- **Codex** 自带 `$skill-creator`，直接调用即可；
- **Claude Code** 可以按 [上一节](./install) 的方法安装 Anthropic 官方的 `skill-creator`。

## Skill 没有生效？

| 现象 | 检查什么 |
|---|---|
| `/skills` 列表里没有 | 文件夹位置对不对？`SKILL.md` 是不是直接在 Skill 文件夹里？文件名是不是 `SKILL.md`（全大写）？ |
| 列表里有，但名字或描述不对 | `---` 是不是在第一行？YAML 格式是否正确？描述里有英文冒号 `:` 时，用英文双引号把整段描述括起来 |
| Agent 该用的时候没用 | 改进 description，写上更多触发词；或者直接点名调用 |
| 不该用的时候总用 | description 写得太宽泛了，把使用场景写得更具体 |
| 修改后没变化 | Claude Code 输入 `/reload-skills`；Codex 重新启动 |

## Claude Code 独有的功能（选学）

Claude Code 为 Skill 扩展了一些字段。它们在 Codex 里会被忽略：

```markdown
---
name: deploy
description: 把网站发布到服务器
disable-model-invocation: true
allowed-tools: Bash(npm run build) Bash(npm run deploy)
---

发布 $ARGUMENTS 环境：
1. 运行 npm run build
2. 运行 npm run deploy
3. 确认发布成功
```

| 字段 / 写法 | 作用 |
|---|---|
| `disable-model-invocation: true` | 只允许你用 `/deploy` 手动调用，Agent 不会自己决定去发布。**有风险的操作建议都加上** |
| `allowed-tools` | 调用这个 Skill 时，预先批准列出的命令，不再逐个询问 |
| `$ARGUMENTS` | 调用时附带的参数，例如 `/deploy 测试` 中的"测试" |

更多字段见 [Claude Code 官方文档](https://code.claude.com/docs/en/skills)。

## 小结

你现在应该会：
- ✅ 判断什么时候该把经验写成 Skill
- ✅ 创建 Skill 文件夹、编写 `SKILL.md`，并在两个工具里确认它被识别
- ✅ 写出能让 Agent 在正确时机想起的 description
- ✅ 用辅助文件实现按需加载
- ✅ 排查 Skill 不生效的常见原因

下一步：[第 7 章 · 实战项目](../07-practice/)，在一个完整的项目里把这些都用起来。

# 病历组件指南

`Case/index.vue` 是 URDOC 平台核心组件之一，用于**展示、编辑、校验**病历（病历）内容。组件与 `useCaseStore` 深度绑定，支持多种视图模式和内容过滤。

## Props

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `settingsVisible` | `Boolean` | `true` | 控制设置面板可见性（传递给工具栏的 `toggleSettings` 事件由父组件处理） |
| `showFooter` | `Boolean` | `undefined` | 控制底部教科书来源标签栏显示。不传则跟随 `stateStore.showCaseFooter` |
| `showActions` | `Boolean` | `true` | 控制顶栏操作按钮（格式切换、生成、校验、复制、朗读等）是否显示 |
| `showHeader` | `Boolean` | `true` | 控制整个头部区域（含标题、Badge、操作按钮）是否显示 |
| `contentInclude` | `Array` | `undefined` | 白名单字段名数组。指定后仅显示这些字段（如 `['姓名', '主诉', '诊断']`） |
| `contentExclude` | `Array` | `undefined` | 黑名单字段名数组。从显示中排除这些字段 |
| `mode` | `String` | `'markdown'` | 默认内容显示格式。`'markdown'` 或 `'text'` |

> `contentInclude` 和 `contentExclude` 互不冲突，先执行 `include` 过滤，再执行 `exclude` 过滤。

## Emits

| 事件 | 载荷 | 说明 |
|---|---|---|
| `toggleSettings` | — | 点击工具栏"设定"按钮时触发，由父组件控制设置面板的展开/收起 |

## Slots

组件基于 `UCard` 构建，提供三个具名插槽区域：

| 名称 | 条件 | 内容 |
|---|---|---|
| `#header` | `showHeader` 为 `true` | 标题栏（"病历" + 状态 Badge）、格式切换按钮、`CaseToolbar` |
| `#default` | 始终渲染 | 主内容区：空状态提示 → `EditorObject`（编辑模式）→ 校验结果 → Markdown/Text 内容 |
| `#footer` | `isFooterVisible` 为 `true` | 教科书来源标签（book / part / chapter / section / subsection / topic）+ 自定义标签 |

底部 footer 的显隐逻辑：
- 传 `showFooter` prop 则直接使用该值
- 未传则跟随 `stateStore.showCaseFooter`（全局状态开关）

## 视图模式

组件内部通过 `viewMode`（`ref<'content' | 'verify'>`）控制两种显示状态：

### content 模式（默认）

展示病历内容，用户可通过 `CaseToolbar` 触发生成、校验、复制等操作。

- **空状态**：当 `caseStore.case.content` 为空且 `status === 'ready'`，显示引导界面 + `ButtonGenerate`
- **有内容**：根据 `contentMode` 显示 Markdown（`Comark`）或纯文本格式
- **编辑状态**：`isEditing` 为 `true` 时使用 `EditorObject` 组件进行对象字段编辑
- **推理面板**：当 `stateStore.case.isReasoning` 为 `true`，显示 `UChatReasoning` 推理面板

### verify 模式

展示 AI 校验结果，用户可查看逐项分析、问题汇总和校验结论。

- **空状态**：显示"正在校验..."或"准备校验..."
- **有结果**：解析 `caseStore.verifyResult`（Markdown）为结构化章节，展示：
  - **逐项分析** — 每一项检查点的详细分析（`UChatReasoning` 折叠面板）
  - **问题汇总** — 发现的问题列表（`UChatReasoning` 折叠面板）
  - **校验结论** — 简要结论卡片（通过/不通过/需修改，带颜色标识）
- 操作按钮：关闭校验、再次校验、自动更正（`handleAutoFix`）、手动更正（打开编辑模式）

## 内容过滤

通过 `contentInclude` 和 `contentExclude` prop 控制 `CaseContent` 对象中哪些字段展示给用户：

```typescript
// 过滤逻辑
let entries = Object.entries(content)
if (props.contentInclude?.length) {
  const set = new Set(props.contentInclude)
  entries = entries.filter(([k]) => set.has(k))
}
if (props.contentExclude?.length) {
  const set = new Set(props.contentExclude)
  entries = entries.filter(([k]) => !set.has(k))
}
```

过滤结果影响 `filteredMarkdown`（Markdown 格式）和 `textContent`（纯文本格式）两个计算属性。

### 文本格式的特殊处理

`textContent` 计算属性将结构化内容转换为连贯的叙事文本：
- 前导字段（`姓名`、`性别`、`年龄`、`主诉`）拼接为第一句
- `现病史`、`既往史` 字段值去掉标签直接拼接
- `专科查体` 字段被排除
- `无` 值的字段被跳过

## Store API

组件依赖 `useCaseStore` 和 `useStateStore`。

### useCaseStore

| 方法/属性 | 类型 | 说明 |
|---|---|---|
| `case` | `Ref<Case>` | 当前病历对象（`id`、`tags`、`textbook`、`custom`、`reasoning`、`content`） |
| `markdown` | `ComputedRef<string>` | 将 `case.content` 格式化为 `**键**：值` 的 Markdown 字符串 |
| `status` | `Ref<string>` | AI 请求状态：`'ready'` / `'submitted'` / `'streaming'` / `'error'` |
| `currentType` | `Ref<string\|null>` | 当前对话类型：`'case'` / `'case-verify'` / `'case-fix'` |
| `verifyResult` | `Ref<string\|null>` | 校验结果原始 Markdown 文本 |
| `verifyReasoning` | `Ref<string\|null>` | 校验过程中的推理/思考内容 |
| `generate()` | 方法 | 根据教科书设定 + 自定义要点生成病历 |
| `verify()` | 方法 | 校验当前病历内容是否符合要求 |
| `fix()` | 方法 | 根据校验报告自动修正病历 |
| `reset()` | 方法 | 重置 case 状态（清空内容、校验结果等） |

### useStateStore

| 属性 | 类型 | 说明 |
|---|---|---|
| `showCaseFooter` | `boolean` | 全局开关，控制 Case 底部来源标签是否显示 |
| `case.isReasoning` | `boolean` | 控制 Case 推理面板是否展开 |

## 子组件

### CaseToolbar（`Case/Toolbar.vue`）

工具栏组件，封装了生成、设定、校验、截屏、复制、朗读、编辑等操作按钮。

**Props：**

| Prop | 类型 | 说明 |
|---|---|---|
| `isGenerating` | `Boolean` | 是否正在生成（控制生成按钮 loading） |
| `hasContent` | `Boolean` | 是否已有病历内容（控制校验/编辑按钮 disabled） |
| `markdown` | `String` | 用于复制和朗读的 Markdown 文本 |
| `captureId` | `String` | 截图功能的目标 DOM 元素 ID（固定为 `'component-case-index'`） |

**v-model：**

| Model | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `editing` | `Boolean` | `false` | 控制编辑模式开关 |

**Emits：**

| 事件 | 说明 |
|---|---|
| `generate` | 请求生成病历 → 调用 `caseStore.generate()` |
| `toggleSettings` | 切换设置面板 → 由父组件处理 |
| `verify` | 请求校验病历 → 调用 `handleVerify()` |

### 其他子组件

| 组件 | 用途 |
|---|---|
| `ButtonGenerate` | 生成按钮（带类型/任务参数） |
| `EditorObject` | 对象字段编辑器（`v-model` 绑定 `caseStore.case.content`） |
| `ButtonCapture` | 截图功能（由 `CaseToolbar` 内部调用） |
| `ButtonClipboard` | 复制到剪贴板（由 `CaseToolbar` 内部调用，传 `markdown`） |
| `ButtonAudio` | 朗读功能（由 `CaseToolbar` 内部调用，传 `markdown`） |
| `Comark` | Markdown 渲染组件（`@comark/nuxt`） |

## 状态 Badge

组件头部显示当前状态 Badge，颜色和文字根据 `caseStore.currentType` 和 `caseStore.status` 动态变化：

| 条件 | 标签 | 颜色 |
|---|---|---|
| `currentType === 'case'` 且正在生成 | 生成中 | info（旋转图标） |
| `currentType === 'case-verify'` 且正在校验 | 校验中 | info（旋转图标） |
| `currentType === 'case-fix'` 且正在修改 | 修改中 | info（旋转图标） |
| 有内容但未校验 | 未校验 | neutral |
| 已校验且通过 | 已校验 | success |
| 已校验但未通过 | 未通过 | warning |
| 无内容 | 不显示 | — |

## 使用示例

```vue
<!-- 基础用法：全功能病历卡片 -->
<Case />

<!-- 仅内容展示，隐藏头部和底部 -->
<Case :show-header="false" :show-footer="false" :show-actions="false" />

<!-- 仅显示特定字段 -->
<Case :content-include="['姓名', '主诉', '现病史', '诊断']" />

<!-- 隐藏某些字段 -->
<Case :content-exclude="['专科查体', '辅助检查']" />

<!-- 纯文本模式 -->
<Case mode="text" />

<!-- 父组件控制设置面板 -->
<Case @toggle-settings="settingsOpen = !settingsOpen" />
```

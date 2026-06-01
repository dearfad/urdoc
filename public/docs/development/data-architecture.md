---
title: '数据组织结构'
description: '通用树形节点模型，Record → flat nodes + parentId 链接，支持多维对比'
---

## 1. 概述

项目以**教学课例对比**为核心场景，采用**通用树形节点模型**组织数据。

一条 Record（记录）包含一颗内容树，树的每个节点是一个 ContentNode，通过 `type` 字段区分内容类型。节点以 **flat 数组 + parentId 引用**的形式存储，支持任意深度嵌套和未来扩展。

### 目标

- 同时管理多条 Record，每条 Record 可包含多份病历（Case）用于对比
- 每份 Case 可生成 Story、Test、Act、Rate 等下级内容
- 任意节点可挂载其"下级"类型节点
- 生成时需获取从根（Case）到目标节点的完整祖先链作为 AI 上下文
- 方便未来新增内容类型或切换存储后端（localStorage / IndexedDB / HTTP）

---

## 2. 核心概念

| 概念 | 说明 |
|------|------|
| **Record**（记录） | 顶层容器，包含元数据和内容节点列表 |
| **ContentNode**（内容节点） | 树中的任意节点，通过 type 区分种类 |
| **ContentType**（节点类型） | 字符串标识，现支持 8 种，可扩展 |
| **parentId / parentType** | 父节点引用，`null` 表示根节点（Case） |
| **祖先链** | 从根节点到当前节点的完整路径，用于构建 AI prompt |

---

## 3. 节点关系图

```
Record "腹痛待查对比"
│
├─ Case 1 (parentId: null)     ← 根节点
│  ├─ Story 1 (parentId: Case1.id)
│  │  ├─ Test 1   (parentId: Story1.id)
│  │  ├─ Test 2   (parentId: Story1.id)
│  │  └─ Act 1    (parentId: Story1.id)
│  ├─ Story 2 (parentId: Case1.id)
│  ├─ Test 3      (parentId: Case1.id)   ← 直接挂 Case 下
│  ├─ Rate 1      (parentId: Case1.id)
│  ├─ Image 1     (parentId: Case1.id)
│  ├─ Speech 1    (parentId: Case1.id)
│  └─ Video 1     (parentId: Case1.id)
│
└─ Case 2 (parentId: null)     ← 对比用，另一份病历
   ├─ Story 3 (parentId: Case2.id)
   │  └─ Test 4 (parentId: Story3.id)
   └─ Rate 2   (parentId: Case2.id)
```

**重要规则**：

- **每个 Record 至少有一个 Case**（根节点，parentId = null）
- **Case 是唯一的根节点类型**，所有其他节点必须有父节点
- **父节点类型必须高于子节点类型**（不允许 Story 生成 Case）
- **同级同类型节点用于对比**（如多个 Case 并行渲染）

---

## 4. 内容类型（ContentType）

当前支持的 8 种类型，按**层级从高到低**排列：

```typescript
type ContentType =
  | 'case'    // 病历（根节点）
  | 'story'   // 故事
  | 'test'    // 考核理论
  | 'act'     // 对话（医患互动）
  | 'rate'    // 评价
  | 'image'   // 图片
  | 'audio'  // 音频
  | 'video'   // 视频
  // 未来扩展直接追加：'illustration' | 'pose' | 'check' | ...
```

**层级顺序**：`case > story > test > act > rate > image > audio > video`

- 层级高的节点可以生成层级低的节点
- 层级低的节点**不能**生成层级高的节点
- 可以跨层级生成（如 Case → Test、Case → Image）

---

## 5. ContentNode 字段定义

```typescript
interface ContentNode<T extends ContentType = ContentType> {
  /** 节点唯一 ID（Record 内唯一） */
  id: number

  /** 节点类型标识 */
  type: T

  /** 所属 Record ID */
  recordId: number

  /** 父节点 ID，null 表示根节点（Case） */
  parentId: number | null

  /** 父节点类型 */
  parentType: T | null

  /** 可选标题（用于 UI 显示区分） */
  title?: string

  /** 标签列表 */
  tags: string[]

  /** 自定义生成要点 */
  custom: string[]

  /** AI 推理过程（reasoning） */
  reasoning: string | null

  /** 核心内容（类型化，详见下方说明） */
  content: any

  /** 创建时间 */
  createdAt: string

  /** 最后修改时间 */
  updatedAt: string
}
```

### content 字段的预期形状（按类型）

| type | content 形状 | 说明 |
|------|-------------|------|
| `case` | `CaseContent \| null` | 结构化病历对象（姓名、主诉、诊断等） |
| `story` | `string \| null` | Markdown 故事文本 |
| `test` | `any` | 考核题目（解析后 JSON） |
| `act` | `ActMessage[]` | 对话消息数组 `[{role, content}]` |
| `rate` | `any` | 评价内容 |
| `image` | `any` | 图片 URL 或 base64 |
| `audio` | `any` | 语音 URL |
| `video` | `any` | 视频 URL |

---

## 6. Record 结构

```typescript
interface RecordItem {
  /** 记录 ID */
  id: number

  /** 标题（用户填写） */
  title: string

  /** 描述（用户填写的备注） */
  description: string

  /** 创建时间 */
  createdAt: string

  /** 最后修改时间 */
  updatedAt: string

  /** 平铺的节点列表（扁平存储，通过 parentId 链接成树） */
  nodes: ContentNode[]
}
```

---

## 7. 核心操作

### 7.1 获取祖先链（用于生成上下文）

```typescript
/**
 * 从指定节点向上遍历到根，返回有序祖先链 [Case, ..., node]
 * 用于构建 AI 生成 prompt 的上下文
 */
function getAncestors(recordId: number, nodeId: number): ContentNode[] {
  const record = records.find(r => r.id === recordId)
  if (!record) return []

  const node = record.nodes.find(n => n.id === nodeId)
  if (!node) return []

  const chain: ContentNode[] = [node]
  let current = node
  while (current.parentId) {
    const parent = record.nodes.find(n => n.id === current.parentId)
    if (parent) {
      chain.unshift(parent)
      current = parent
    } else break
  }
  return chain  // 例: [Case, Story, Test]
}
```

### 7.2 获取子节点

```typescript
/** 获取指定节点的直接子节点 */
function getChildren(recordId: number, nodeId: number | null): ContentNode[]
```

### 7.3 获取同级节点（用于对比）

```typescript
/** 获取同父节点、同类型的节点列表，用于对比渲染 */
function getSiblings(recordId: number, nodeId: number): ContentNode[]
```

### 7.4 按类型筛选

```typescript
/** 按类型和父节点筛选 */
function getNodesByType(
  recordId: number,
  type: string,
  parentId?: number
): ContentNode[]
```

---

## 8. 生成流程与自动同步

### 8.1 用户手动选择父节点

生成前，UI 设置目标父节点，告知 recordStore 新节点要挂到谁下面：

```typescript
// UI 中用户选中一个节点后触发
recordStore.targetParentId = selectedNode.id
recordStore.targetParentType = selectedNode.type
// 然后调用对应子 store 的 generate()
storyStore.generate()
```

### 8.2 子 Store 的 onComplete 回调

每个 workspace store 需要暴露 `onComplete` 回调，在流式生成完成后触发：

```typescript
// stores/story.ts（改动最小，新增 3 行）
export const useStoryStore = defineStore('story', () => {
  const story = ref<Story>({ ... })
  const chat = new Chat({ ... })
  const status = computed(() => chat.status === 'idle' ? 'ready' : chat.status)

  // ★ 新增：生成完成回调
  const onComplete = ref<((data: any) => void) | null>(null)

  // ★ 新增：流式完成后触发
  watchOnce(
    () => status.value,
    (s) => {
      if (s === 'ready' && onComplete.value) {
        onComplete.value({ ...story.value })
      }
    }
  )

  return { version, story, status, reset, generate, /* ★ */ onComplete }
})
```

### 8.3 Record Store 的自动同步

```typescript
// recordStore.setupAutoSync() 统一注册所有 workspace store
function setupAutoSync() {
  const configs = [
    { store: useCaseStore(),  type: 'case'  },
    { store: useStoryStore(), type: 'story' },
    { store: useTestStore(),  type: 'test'  },
    { store: useActStore(),   type: 'act'   },
    { store: useRateStore(),  type: 'rate'  },
    { store: useImageStore(), type: 'image' },
    { store: useAudioStore(), type: 'audio'},
    { store: useVideoStore(), type: 'video' },
  ]

  for (const { store, type } of configs) {
    store.onComplete = (data: any) => {
      if (!activeRecordId.value) return

      const node = addNode(
        targetParentId.value,   // 用户手动选择的父节点
        type,
        data
      )

      // 清空目标父节点
      targetParentId.value = null
      targetParentType.value = null
    }
  }
}
```

### 8.4 完整用户操作流

```
1. 用户打开/新建 Record
2. 用户选中一个 Case（或 Story 等节点）
   → recordStore.targetParentId = 选中节点.id
3. 用户点击"生成故事"
   → storyStore.generate() 开始流式生成
4. AI 流式输出，storyStore 逐帧更新内容
5. 生成完成，status 变为 'ready'
   → watchOnce 触发 → onComplete 回调
   → recordStore.addNode(targetParentId, 'story', data)
   → 新 Story 节点被挂到选中的父节点下
   → recordStore.save()（持久化）
```

---

## 9. 对比机制

**同级同类型的多个节点**天然构成对比组，UI 并行渲染：

```typescript
// 获取 Record 下所有 Case 节点（同级）
const cases = recordStore
  .getChildren(recordId, null)
  .filter(n => n.type === 'case')

// 获取 Case1 下所有 Story 节点
const stories = recordStore
  .getChildren(recordId, case1Id)
  .filter(n => n.type === 'story')

// UI 并行展示：
// ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
// │ Case 1: 张三  │  │ Case 2: 李四  │  │ Case 3: 王五  │
// │ 主诉: 腹痛    │  │ 主诉: 头痛    │  │ 主诉: 发热    │
// │ 诊断: 胃炎    │  │ 诊断: 偏头痛  │  │ 诊断: 流感    │
// └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 10. 数据存储格式（localStorage）

```json
{
  "version": "2026-06-01",
  "maxId": 10,
  "records": [
    {
      "id": 1,
      "title": "腹痛待查对比",
      "description": "使用不同教材生成的病历对比",
      "createdAt": "2026-06-01T10:00:00Z",
      "updatedAt": "2026-06-01T12:00:00Z",
      "nodes": [
        {
          "id": 1,
          "type": "case",
          "recordId": 1,
          "parentId": null,
          "parentType": null,
          "tags": ["消化内科"],
          "custom": ["老年患者"],
          "reasoning": "患者65岁...",
          "content": { "姓名": "张三", "主诉": "腹痛3天", "诊断": "胃炎" },
          "createdAt": "2026-06-01T10:00:00Z",
          "updatedAt": "2026-06-01T10:05:00Z"
        },
        {
          "id": 2,
          "type": "story",
          "recordId": 1,
          "parentId": 1,
          "parentType": "case",
          "tags": [],
          "custom": [],
          "reasoning": null,
          "content": "张大爷捂着肚子走进了诊室...",
          "createdAt": "2026-06-01T10:10:00Z",
          "updatedAt": "2026-06-01T10:10:00Z"
        }
      ]
    }
  ]
}
```

---

## 11. 添加新的 ContentType

只需 3 步，无需改动核心数据结构：

```
Step 1 — 注册类型名称
  types/node.ts 的 ContentType 联合类型中追加字符串
  → type ContentType = 'case' | 'story' | ... | 'illustration'

Step 2 — 创建 workspace store
  新建 stores/illustration.ts，复用现有模式：
  Chat + status + generate() + onComplete

Step 3 — 注册到 auto-sync
  recordStore.setupAutoSync() 中追加配置项：
  → { store: useIllustrationStore(), type: 'illustration' }
```

**不需要改动**的内容：

- ContentNode 接口定义（`content: any` 已经通用）
- getAncestors / getChildren / getSiblings（通用树操作）
- 持久化逻辑（flat nodes 天然支持）
- 对比渲染逻辑（getSiblings 通用）

---

## 12. Record Store API 总览

### State

| 字段 | 类型 | 说明 |
|------|------|------|
| `records` | `RecordItem[]` | 所有记录 |
| `maxId` | `number` | ID 计数器 |
| `activeRecordId` | `number \| null` | 当前活动的 Record ID |
| `targetParentId` | `number \| null` | 用户手动选择的父节点 ID |
| `targetParentType` | `ContentType \| null` | 用户手动选择的父节点类型 |

### Methods

| 方法 | 说明 |
|------|------|
| `createRecord(title, desc?)` | 新建记录 |
| `deleteRecord(id)` | 删除记录及其所有节点 |
| `addNode(parentId, type, data)` | 在指定父节点下创建新节点 |
| `updateNode(nodeId, data)` | 更新节点数据 |
| `deleteNode(nodeId)` | 删除节点及其子树 |
| `getAncestors(recordId, nodeId)` | 获取祖先链 |
| `getChildren(recordId, nodeId)` | 获取子节点列表 |
| `getSiblings(recordId, nodeId)` | 获取同级节点列表 |
| `getNodesByType(recordId, type, parentId?)` | 按类型筛选 |
| `setupAutoSync()` | 注册所有 workspace store 的自动同步 |

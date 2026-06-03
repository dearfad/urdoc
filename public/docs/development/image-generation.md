# 图片生成系统

图片生成系统为 URDOC 平台提供多模态图像生成能力，支持**自定义文生图**、**医学头像生成**和**故事插图生成**三种任务模式。

## 架构概览

```
客户端（Vue/Composable）                 服务端（Nitro/API）
┌───────────────────┐     POST /api/image    ┌─────────────────────────────┐
│  useImageApi()    │ ──────────────────────> │  /api/image/index.ts        │
│  (composable)     │                        │  ① 加载 prompt 模板（可选） │
│                   │ <────────────────────── │  ② generateText 生成 prompt │
│  轮询（异步时）：  │     JSON response       │  ③ 调用图片生成 API          │
│  GET /api/image   │                        └──────────┬──────────────────┘
│  /status?id=xxx   │                                   │
│                   │                        ┌──────────┴──────────┐
└───────────────────┘                        │  同步 (Agnes)        │
                                             │  立即返回 URL        │
                                             ├─────────────────────┤
             ┌───────────────────┐           │  异步 (ModelScope)   │
             │  store/image.ts   │           │  返回 taskId         │
             │  generate()       │           └─────────────────────┘
             │  face()           │
             │  illustration()   │
             └───────────────────┘
```

## 请求与响应

### 通用请求体

```typescript
{
  type: 'image',
  task: 'generate' | 'face' | 'illustration',
  prompt: string,           // 用户输入的文本描述
  messages?: Message[],     // 结构化消息（可选）
  model: {
    provider: string,       // 文本模型提供商（如 InternAi）
    name: string,           // 文本模型名称
    apiKey: string,         // runtimeConfig 中的 key 名
    baseURL: string,        // API 基础地址
  },
  imageModel?: {            // 图片生成模型（可选，不传则复用 model）
    provider: string,
    name: string,
    apiKey: string,
    baseURL: string,
  },
  imageSize?: string,       // 默认 '1024x1024'
  n?: number,               // 图片数量，默认 1
}
```

### 同步响应

```typescript
{
  sync: true,
  images: [{ url: string }],
}
```

### 异步响应

```typescript
{
  sync: false,
  taskId: string,   // 客户端轮询 /api/image/status?id=xxx
}
```

### 状态轮询响应

```
GET /api/image/status?id=xxx

// 进行中
{ status: 'pending' }

// 成功
{ status: 'succeeded', images: [{ url: string }] }

// 失败
{ status: 'failed', error: string }
```

## 三种任务模式

### 1. 自定义生成（generate）

最简单的文生图模式。用户输入一段描述文字，服务端直接将其作为 prompt 调用图片生成 API。

**调用链路：**
1. 用户在「自定义生成」Tab 输入 prompt
2. 点击「生成图像」→ `imageStore.generate()`
3. `imageApi.generate(prompt, { task: 'generate', model })`
4. `POST /api/image` → 服务端直接调用图片 API
5. 返回图片 URL

### 2. 生成头像（face）

基于病例数据生成患者医学肖像。需要先创建病例（`caseStore.case.content`）。

**调用链路：**
1. 用户在「生成头像」Tab 点击按钮 → `imageStore.face()`
2. Store 从 `useCaseStore().case.content` 读取病例数据
3. `imageApi.generate(JSON.stringify(caseContent), { task: 'face', model })`
4. `POST /api/image` →
   - 服务端加载 `server/prompts/face/generate.ts` 提示词模板
   - 调用文本模型（`generateText`）提取病例特征并生成图片描述 prompt
   - 调用图片生成 API
5. 返回图片 URL

**prompt 模板：** `server/prompts/face/generate.ts`

模板要求 AI 从病例中提取性别、年龄、疾病特征等关键信息，生成包含"中国人，在医院拍摄"的逗号分隔提示词。

### 3. 故事插图（illustration）

基于故事内容生成 4 张故事插图。需要先创建故事（`storyStore.story.content`）。

**调用链路：**
1. 用户在「故事插图」Tab 点击按钮 → `imageStore.illustration()`
2. Store 从 `useStoryStore().story.content` 读取故事文本
3. `imageApi.generate(storyContent, { task: 'illustration', model })`
4. `POST /api/image` →
   - 服务端加载 `server/prompts/illustration/generate.ts` 提示词模板
   - 调用文本模型将故事分解为 4 个关键场景描述
   - 分别调用图片生成 API
5. 返回 4 张图片 URL

**prompt 模板：** `server/prompts/illustration/generate.ts`

模板要求 AI 将故事分解为 4 个关键片段，每个片段生成独立的人物+动作+场景描述。

## 同步 vs 异步模式

| 模式 | 适用 Provider | 实现方式 |
|------|--------------|---------|
| **同步** | Agnes `agnes-image-2.0-flash` | 服务端直接 POST 图片 API，返回 URL |
| **异步（服务端轮询）** | ModelScope / BigModel | 返回 `taskId`，服务端后台轮询，客户端通过 `GET /api/image/status` 查询结果 |

### 同步模式流程

```
客户端                  服务端                      图片 API
  │                      │                           │
  ├── POST /api/image ──>│                           │
  │                      ├── POST /images/generations ──>│
  │                      │<── { data: [{ url }] } ──────┤
  │<── { sync: true, images }                          │
```

### 异步模式流程

```
客户端                  服务端                      图片 API
  │                      │                           │
  ├── POST /api/image ──>│                           │
  │                      ├── POST /images/generations ──>│
  │                      │<── { task_id } ───────────────┤
  │                      │   （存入 imageTaskStore）      │
  │<── { sync: false, taskId }                         │
  │                      │                           │
  ├── GET /status?id=xxx>│                           │
  │                      ├── GET /tasks/{id} ─────────>│
  │                      │<── { task_status } ─────────┤
  │<── { status }        │                           │
  │  (轮询直到完成)       │                           │
```

## Provider 配置

### 当前支持

| Provider | Provider Key | 默认模型 | API 端点 | 模式 |
|----------|-------------|---------|---------|------|
| Agnes    | `Agnes`     | `agnes-image-2.0-flash` | `https://apihub.agnes-ai.com/v1/images/generations` | 同步 |

### 预留扩展

| Provider | Provider Key | 模式 |
|----------|-------------|------|
| BigModel | `BigModel`  | 异步 |
| ModelScope | `ModelScope` | 异步（带 `X-ModelScope-Async-Mode` header） |

### 添加新 Provider

在 `server/api/image/index.ts` 中：

1. 在 `IMAGE_PROVIDER_DEFAULTS` 添加默认配置：

```typescript
const IMAGE_PROVIDER_DEFAULTS = {
  NewProvider: {
    baseURL: 'https://api.example.com/v1',
    defaultModel: 'model-name',
  },
}
```

2. 如果该 Provider 支持**同步** API，无需额外代码（自动路由到 `providerCfg` 分支）。

3. 如果该 Provider 是**异步**模式，在 `defineEventHandler` 中添加：

```typescript
if (providerKey === 'NewAsyncProvider') {
  const taskId = crypto.randomUUID()
  imageTaskStore.set(taskId, { ... })
  processAsyncImageGeneration(taskId, imagePrompt, imgModel, config)
  return { sync: false, taskId }
}
```

4. 同时在 `processAsyncImageGeneration` 函数中添加该 Provider 的 API 端点和轮询逻辑。

## .env 配置

```env
# 已在 runtimeConfig 中注册
NUXT_AGNES_API_KEY=your_agnes_api_key
```

## 文件索引

| 文件 | 用途 |
|------|------|
| `server/api/image/index.ts` | 图片生成 API 主端点 |
| `server/api/image/status.get.ts` | 异步任务轮询端点 |
| `server/api/image/store.ts` | 任务状态内存存储（Map） |
| `server/prompts/index.ts` | Prompt 映射（含 image 类型） |
| `server/prompts/face/generate.ts` | 头像生成 prompt 模板 |
| `server/prompts/illustration/generate.ts` | 插图生成 prompt 模板 |
| `app/composables/useImageApi.ts` | 客户端图片 API composable |
| `app/stores/image.ts` | 图片生成状态管理 |
| `app/components/Image/index.vue` | 图片创作 UI 组件 |
| `app/components/Image/Settings.vue` | 图片设置面板 |
| `app/pages/multimodal/image.vue` | 图片创作页面 |

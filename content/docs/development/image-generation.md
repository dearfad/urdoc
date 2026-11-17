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

基于当前已有的病例、故事等资料生成患者医学肖像。资料可能不完整，也可以只凭已有内容生成。

**调用链路：**
1. 用户在「生成头像」Tab 点击按钮 → `imageStore.face()`
2. `streamPrompt('face')` 通过 `buildGenerationContext({ type: 'face', task: 'generate', target: 'image' })` 读取基础提示词与此刻已有的全部资料；`target: 'image'` 会排除图像步骤自身，避免旧头像结果干扰
3. 在 `streamPrompt` 中按当前界面语言（i18n locale）注入人种约束：`zh`→中国人、`en`→美国人，其他语言→该语言对应地区人种；随后调用 `/api/chat` 由文本模型流式生成头像提示词
4. 生成的提示词实时展示在「生成提示词」区，流结束后作为最终提示词
5. `imageApi.generate(facePrompt, { task: 'face', model })` → `POST /api/image` → 调用文生图模型生成头像
6. 返回图片 URL，并记录本次使用的提示词

**prompt 模板：** `app/assets/prompts/face/generate.md`

模板覆盖主体身份、面部特征、皮肤质感、发型发色、表情神态、疾病体征、着装、姿态、构图镜头、背景环境、光线氛围、摄影风格、画质等维度，输出为逗号分隔的纯文本提示词；人种不写死，而是按当前界面语言映射并自然融入主体身份描述，医院场景作为背景维度保留。

### 3. 故事插图（illustration）

基于当前已有资料生成 4 张故事插图。

**调用链路：**
1. 用户在「故事插图」Tab 点击按钮 → `imageStore.illustration()`
2. `streamPrompt('illustration')` 同样通过 `buildGenerationContext` 读取基础提示词与已有资料，调用 `/api/chat` 由文本模型将故事分解为 4 段提示词
3. 以已生成的患者头像（若有）为参考图，逐段调用 `imageApi.generate(p, { task: 'illustration', image: faceImage })`，每段生成一张并即时写入
4. 返回 4 张图片 URL

**prompt 模板：** `app/assets/prompts/illustration/generate.md`

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
| Agnes    | `Agnes`     | `agnes-image-2.1-flash` | `https://api.agnes-ai.cn/v1/images/generations` | 同步 |

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
| `app/assets/prompts/face/generate.md` | 头像生成 prompt 模板（含语言与人种映射规则） |
| `app/assets/prompts/illustration/generate.md` | 插图生成 prompt 模板 |
| `app/utils/prompts.ts` | 内置 prompt 模板加载器（import.meta.glob） |
| `app/utils/context.ts` | 已有资料上下文拼装（buildGenerationContext） |
| `app/composables/useImageApi.ts` | 客户端图片 API composable |
| `app/stores/image.ts` | 图片生成状态管理 |
| `app/components/Image/index.vue` | 图片创作 UI 组件 |
| `app/components/Image/Settings.vue` | 图片设置面板 |
| `app/pages/multimodal/image.vue` | 图片创作页面 |

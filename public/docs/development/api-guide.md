# API 接口指南

后端 API 遵循 **统一入口 + 内部分发** 的插件式架构，共 4 个核心接口 + 1 个独立接口。

## 接口一览

| 路径 | 用途 | 分发方式 |
|---|---|---|
| `/api/chat` | AI 对话（流式/非流式） | `model.provider` |
| `/api/image` | 图片生成 | `model.provider` |
| `/api/audio` | 语音合成（TTS） | `model.provider` |
| `/api/video` | 视频生成 | `model.provider` |
| `/api/github/commit` | 查询 GitHub 提交日期 | 固定 |

所有接口统一接收 `POST` 请求，`Content-Type: application/json`。

## 目录结构

```
server/api/
├── chat/                  ← AI 对话
│   ├── index.ts           ← 路由分发
│   └── providers/
│       └── aisdk.ts       ← AI SDK 对话（流式 + 非流式）
├── image/                 ← 图片生成
│   ├── index.ts
│   └── providers/
│       ├── bigmodel.ts    ← BigModel 平台
│       └── agnes.ts       ← Agnes 平台
├── audio/                 ← 语音合成
│   ├── index.ts
│   └── providers/
│       ├── xiaomi.ts      ← 小米 TTS（同步）
│       └── gitee.ts       ← Gitee Audio（异步任务）
├── video/                 ← 视频生成
│   ├── index.ts
│   └── providers/
│       └── agnes.ts       ← Agnes（异步任务）
└── github/
    └── commit.js          ← 独立接口，不变
```

## 路由分发机制

每个 `index.ts` 从请求体中读取 `model.provider`，查表分发到对应的 provider：

```ts
import { handle as aisdk } from './providers/aisdk'

const handlers: Record<string, (body: any) => any> = {
  aisdk,
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const provider = body?.model?.provider
  if (!provider) {
    throw createError({
      statusCode: 400,
      statusMessage: `不支持的 provider: ${provider}`,
    })
  }
  // 未注册的 provider 回退到通用 aisdk handler
  const handler = handlers[provider] || handlers.aisdk
  return handler(body)
})
```

**添加厂家** = 在 `providers/` 下新建文件 + 在 `handlers` 中注册一行（可选）。
若未注册，自动回退到通用 `aisdk` handler（仅适用于 OpenAI 兼容接口）。
**删除厂家** = 删除 provider 文件 + 从 `handlers` 中去掉对应行。互不影响。

## 接口详情

### `/api/chat` — AI 对话

```
POST /api/chat
Body: { messages, model, system?, providerOptions?, stream? }
```

- `stream: true`（默认）→ 返回 SSE 流（`ai` SDK 的 `toUIMessageStreamResponse`）
- `stream: false` → 返回 `{ result: string }`

当前 provider：

| provider | 说明 |
|---|---|
| `aisdk`（通用回退） | 通用 OpenAI 兼容接口，未注册的 provider（如 `InternAi`、`BigModel`、`OpenRouter`、`Agnes`）自动回退至此 |

### `/api/image` — 图片生成

```
POST /api/image
Body: { prompt, model, n?, size?, quality?, seed?, tags?, image? }
```

当前 provider：

| provider | 说明 | 特有字段 |
|---|---|---|
| `bigmodel` | BigModel 平台 | `size`, `quality` |
| `agnes` | Agnes 平台 | `size`, `seed`, `tags`, `image` |

返回格式：`{ images: [{ base64, mediaType }], originalUrls: string[] }`

### `/api/audio` — 语音合成

```
POST /api/audio
Body: { model, text, style?, voice?, format?, task?, input?, taskId? }
```

当前 provider：

| provider | 说明 | 请求字段 | 返回 |
|---|---|---|---|
| `xiaomi` | 小米 TTS（同步） | `model`, `text`, `style?`, `voice?`, `format?` | `{ base64, mediaType }` |
| `gitee` | Gitee（异步任务） | `task: 'create'`, `model`, `input` | `{ taskId }` |
| | 查询任务 | `task: 'query'`, `taskId`, `model` | `{ status, file_url }` |

- 同步 provider 直接返回音频 base64 数据
- 异步 provider 需客户端先 `create` 获取 `taskId`，再轮询 `query` 直到 `status === 'success'`

### `/api/video` — 视频生成

```
POST /api/video
Body: { task, model, prompt?, taskId?, image?, num_frames?, ... }
```

当前 provider：

| provider | 说明 |
|---|---|
| `agnes` | Agnes 视频生成（异步任务） |

- `task: 'create'` → `{ taskId, status, progress }`
- `task: 'query'` → `{ status, progress, video_url }`

客户端创建任务后轮询 `query` 直到 `status === 'completed'`。

### `/api/github/commit` — 部署状态

```
POST /api/github/commit
Body: { branch }
返回: "2026-06-15"
```

获取指定分支的最新提交日期，用于展示部署状态。

## Provider 开发规范

每个 provider 文件导出一个 `handle` 函数：

```ts
export async function handle(body: YourType) {
  // 1. 校验必要字段
  // 2. 通过 useRuntimeConfig() 获取 API Key
  // 3. 调用第三方 API
  // 4. 返回统一格式的响应
}
```

- 不调用 `readBody(event)`——body 已由 `index.ts` 解析传入
- 不处理路由逻辑——只负责具体厂商的 API 调用
- 错误统一使用 `createError` 抛出

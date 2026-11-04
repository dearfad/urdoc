import { randomUUID } from 'node:crypto'

// 本机 ComfyUI 生图 provider，复用 /api/image 现有的 provider 契约。
// 官方 HTTP API 参考：https://docs.comfy.org/zh/development/comfyui-server/api-examples.md
// 仅支持与 Nuxt 服务端同机运行的 ComfyUI Desktop，默认 http://127.0.0.1:8188，无需 API Key。

export const DEFAULT_COMFY_BASE = 'http://127.0.0.1:8188'

const VIEW_PATH = '/api/image/comfy/view'
const NEGATIVE_PROMPT = 'low quality, blurry, bad anatomy, bad hands, watermark, text'
const POLL_INTERVAL_MS = 1000
const POLL_TIMEOUT_MS = 5 * 60 * 1000

interface ComfyImage {
  filename: string
  subfolder: string
  type: string
}

interface ComfyBody {
  prompt: string
  model: { provider?: string; name?: string; apiKey?: string; baseURL?: string }
  n?: number
  size?: string
  seed?: number
  image?: string
}

type ImageResult = { images: { base64: string; mediaType: string }[]; originalUrls: string[] }

// 仅允许访问本机 ComfyUI，避免 baseURL 被当作任意内网/公网地址使用（SSRF）
export function normalizeComfyBase(raw: string): string {
  const value = (raw || DEFAULT_COMFY_BASE).trim().replace(/\/+$/, '')
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'ComfyUI Base URL 格式非法，请填写 http://127.0.0.1:8188' })
  }
  if (parsed.protocol !== 'http:') {
    throw createError({ statusCode: 400, statusMessage: 'ComfyUI 仅支持本机 http 地址' })
  }
  const host = parsed.hostname.toLowerCase()
  const isLocal = host === 'localhost' || host === '[::1]' || host === '::1' || /^127\./.test(host)
  if (!isLocal) {
    throw createError({ statusCode: 400, statusMessage: 'ComfyUI 仅支持本机地址（127.0.0.1 / localhost）' })
  }
  return `${parsed.origin}${parsed.pathname.replace(/\/+$/, '')}`
}

async function comfyFetch(base: string, path: string, init?: RequestInit): Promise<Response> {
  let res: Response
  try {
    res = await fetch(`${base}${path}`, init)
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: `无法连接本机 ComfyUI（${base}），请确认 ComfyUI Desktop 已启动且 Base URL 正确`,
    })
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    const suffix = detail ? `：${detail.slice(0, 200)}` : ''
    throw createError({
      statusCode: 502,
      statusMessage: `ComfyUI 请求 ${path} 失败（上游返回 ${res.status}）${suffix}`,
    })
  }
  return res
}

// 零配置：自动选用本机第一个已安装的 checkpoint，用户无需导出或配置工作流
async function resolveCheckpoint(base: string): Promise<string> {
  try {
    const res = await comfyFetch(base, '/object_info/CheckpointLoaderSimple')
    const info: any = await res.json()
    const names = info?.CheckpointLoaderSimple?.input?.required?.ckpt_name?.[0]
    if (Array.isArray(names) && names.length) return String(names[0])
  } catch {
    // 旧版本可能没有 object_info 端点，回退到 /models/checkpoints
  }

  const res = await comfyFetch(base, '/models/checkpoints')
  const list: any = await res.json()
  const first = Array.isArray(list) ? list[0] : undefined
  const name = typeof first === 'string' ? first : first?.name
  if (name) return String(name)

  throw createError({
    statusCode: 400,
    statusMessage: '本机 ComfyUI 未找到可用的 checkpoint 模型，请先在 ComfyUI 中安装模型',
  })
}

function parseSize(size?: string): { width: number; height: number } {
  const match = /^(\d{2,4})[x×](\d{2,4})$/i.exec(String(size ?? '').trim())
  if (!match) return { width: 512, height: 512 }
  // ComfyUI 的 latent 尺寸需为 8 的倍数
  const normalize = (v: number) => Math.min(Math.max(Math.round(v / 8) * 8, 64), 2048)
  return { width: normalize(Number(match[1])), height: normalize(Number(match[2])) }
}

// 官方标准文生图工作流（API 格式）：加载模型 → 正/负提示词编码 → 采样 → VAE 解码 → 保存
function buildWorkflow(options: {
  ckptName: string
  prompt: string
  width: number
  height: number
  batchSize: number
  seed: number
}): Record<string, unknown> {
  const { ckptName, prompt, width, height, batchSize, seed } = options
  return {
    '3': {
      class_type: 'KSampler',
      inputs: {
        cfg: 8,
        denoise: 1,
        latent_image: ['5', 0],
        model: ['4', 0],
        negative: ['7', 0],
        positive: ['6', 0],
        sampler_name: 'euler',
        scheduler: 'normal',
        seed,
        steps: 20,
      },
    },
    '4': { class_type: 'CheckpointLoaderSimple', inputs: { ckpt_name: ckptName } },
    '5': { class_type: 'EmptyLatentImage', inputs: { batch_size: batchSize, height, width } },
    '6': { class_type: 'CLIPTextEncode', inputs: { clip: ['4', 1], text: prompt } },
    '7': { class_type: 'CLIPTextEncode', inputs: { clip: ['4', 1], text: NEGATIVE_PROMPT } },
    '8': { class_type: 'VAEDecode', inputs: { samples: ['3', 0], vae: ['4', 2] } },
    '9': { class_type: 'SaveImage', inputs: { filename_prefix: 'urdoc', images: ['8', 0] } },
  }
}

async function submitPrompt(base: string, workflow: Record<string, unknown>): Promise<string> {
  const res = await comfyFetch(base, '/prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: workflow, client_id: randomUUID() }),
  })
  const json: any = await res.json()
  if (json?.error) {
    const nodes = Object.keys(json.node_errors ?? {}).join('、')
    const suffix = nodes ? `（节点 ${nodes}）` : ''
    throw createError({ statusCode: 400, statusMessage: `ComfyUI 拒绝工作流：${json.error}${suffix}` })
  }
  if (!json?.prompt_id) {
    throw createError({ statusCode: 502, statusMessage: 'ComfyUI 未返回 prompt_id，无法查询生成结果' })
  }
  return String(json.prompt_id)
}

function collectImages(outputs: any): ComfyImage[] {
  const images: ComfyImage[] = []
  for (const node of Object.values(outputs ?? {}) as any[]) {
    for (const item of (node?.images ?? []) as any[]) {
      if (!item?.filename) continue
      images.push({
        filename: String(item.filename),
        subfolder: String(item.subfolder ?? ''),
        type: String(item.type ?? 'output'),
      })
    }
  }
  return images
}

function formatExecutionError(item: any): string {
  const hint = '请确认本机已安装文生图 checkpoint 模型（如 SD1.5 / SDXL）'
  const messages = item?.status?.messages
  if (Array.isArray(messages)) {
    for (const entry of messages) {
      if (Array.isArray(entry) && entry[0] === 'execution_error') {
        const detail = entry[1] ?? {}
        const reason = String(detail.exception_message || detail.exception_type || '未知错误').trim()
        return `ComfyUI 工作流执行失败：${reason}；${hint}`
      }
    }
  }
  return `ComfyUI 工作流执行失败，请在 ComfyUI 界面查看错误详情；${hint}`
}

// 纯 HTTP 轮询，避免引入 WebSocket 依赖；最长等待 5 分钟
async function waitForImages(base: string, promptId: string): Promise<ComfyImage[]> {
  const deadline = Date.now() + POLL_TIMEOUT_MS
  while (Date.now() < deadline) {
    const res = await comfyFetch(base, `/history/${encodeURIComponent(promptId)}`)
    const history: any = await res.json()
    const item = history?.[promptId]
    if (item?.status?.status_str === 'error') {
      throw createError({ statusCode: 502, statusMessage: formatExecutionError(item) })
    }
    const images = collectImages(item?.outputs)
    if (images.length) return images
    if (item?.status?.completed) {
      throw createError({ statusCode: 502, statusMessage: 'ComfyUI 已完成执行但未返回图片，请检查工作流输出节点' })
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }
  throw createError({ statusCode: 504, statusMessage: 'ComfyUI 生图超时（5 分钟），请检查 ComfyUI 队列与显存状态' })
}

// 交给同源代理取图，originalUrls 只保存短相对 URL，避免 base64 撑爆 localStorage
function buildViewUrl(base: string, image: ComfyImage): string {
  const params = new URLSearchParams({
    base,
    filename: image.filename,
    subfolder: image.subfolder,
    type: image.type,
  })
  return `${VIEW_PATH}?${params.toString()}`
}

export async function handle(body: ComfyBody): Promise<ImageResult> {
  const { prompt, model, n, size, seed } = body
  // 故事插图会传入参考图 image，内置纯文生图工作流暂不使用，此处显式说明以免误解
  if (!prompt) {
    throw createError({ statusCode: 400, statusMessage: 'prompt 不能为空' })
  }

  const base = normalizeComfyBase(String(model?.baseURL ?? ''))
  const ckptName = await resolveCheckpoint(base)
  const { width, height } = parseSize(size)
  const batchSize = Math.min(Math.max(Math.floor(Number(n) || 1), 1), 4)
  const workflowSeed = Number.isFinite(seed) ? Math.floor(Number(seed)) : Math.floor(Math.random() * 2 ** 31)

  const workflow = buildWorkflow({
    ckptName,
    prompt,
    width,
    height,
    batchSize,
    seed: workflowSeed,
  })
  const promptId = await submitPrompt(base, workflow)
  const images = await waitForImages(base, promptId)

  // useImageApi 允许 images 为空，imageStore 只消费 originalUrls
  return { images: [], originalUrls: images.map((img) => buildViewUrl(base, img)) }
}

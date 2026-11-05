import { randomUUID } from 'node:crypto'

// 自定义远端 OpenAI 兼容图像 API provider。
// 仅处理 Custom 且名称不是 ComfyUI 的图像模型；内置 BigModel / Agnes 仍走各自原有 handler。
// 与现有 provider 一致，返回 { images, originalUrls }；originalUrls 只存短 URL，避免撑爆 localStorage。

interface RemoteBody {
  prompt: string
  model: { provider?: string; name?: string; apiKey?: string; baseURL?: string }
  n?: number
  size?: string
  seed?: number
  image?: string
}

type ImageResult = { images: { base64: string; mediaType: string }[]; originalUrls: string[] }

const VIEW_PATH = '/api/image/remote/view'
const CACHE_LIMIT = 50
const imageCache = new Map<string, { buffer: Buffer; mediaType: string }>()

// b64_json 没有可持久化的源 URL，缓存到进程内并通过同源短 URL 暴露
export function getRemoteImage(id: string) {
  return imageCache.get(id)
}

function cacheRemoteImage(base64: string, mediaType: string): string {
  const id = randomUUID()
  imageCache.set(id, { buffer: Buffer.from(base64, 'base64'), mediaType })
  while (imageCache.size > CACHE_LIMIT) {
    const oldest = imageCache.keys().next().value
    if (!oldest) break
    imageCache.delete(oldest)
  }
  return id
}

// 参照 proxy.get.ts 的内网防护，避免用户填写的 Base URL 被用于访问本机或内网服务（SSRF）
function normalizeRemoteBase(raw: string): string {
  const value = String(raw ?? '').trim().replace(/\/+$/, '')
  if (!value) {
    throw createError({ statusCode: 400, statusMessage: '自定义远端 API 未配置 Base URL' })
  }
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    throw createError({ statusCode: 400, statusMessage: '自定义远端 API 的 Base URL 格式非法' })
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw createError({ statusCode: 400, statusMessage: '自定义远端 API 仅支持 http/https' })
  }
  const host = parsed.hostname.toLowerCase()
  const isInternal =
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host === '[::1]' ||
    host === '::1' ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  if (isInternal) {
    throw createError({ statusCode: 400, statusMessage: '自定义远端 API 不允许使用本机或内网地址' })
  }
  return `${parsed.origin}${parsed.pathname.replace(/\/+$/, '')}`
}

async function downloadImage(url: string) {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    return { base64: buffer.toString('base64'), mediaType: res.headers.get('content-type') || 'image/png' }
  } catch {
    return null
  }
}

export async function handle(body: RemoteBody): Promise<ImageResult> {
  const { prompt, model, n, size, seed, image } = body
  if (!prompt) {
    throw createError({ statusCode: 400, statusMessage: 'prompt 不能为空' })
  }

  const name = String(model?.name ?? '').trim()
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: '自定义远端 API 未配置模型名称' })
  }
  const base = normalizeRemoteBase(String(model?.baseURL ?? ''))
  // Custom 的 apiKey 为用户填写的原始密钥，由 resolveApiKey 直接返回
  const apiKey = resolveApiKey({ provider: String(model?.provider ?? ''), apiKey: String(model?.apiKey ?? '') })
  if (!apiKey) {
    throw createError({ statusCode: 400, statusMessage: '自定义远端 API 未配置 API Key' })
  }

  const reqBody: Record<string, unknown> = { model: name, prompt }
  if (n) reqBody.n = n
  if (size) reqBody.size = size
  if (seed != null) reqBody.seed = seed
  // 与 agnes.ts 保持一致：有参考图时放进 extra_body.image
  if (image) reqBody.extra_body = { image }

  let res: Response
  try {
    res = await fetch(`${base}/images/generations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
      signal: AbortSignal.timeout(120_000),
    })
  } catch {
    throw createError({ statusCode: 502, statusMessage: '自定义远端 API 连接失败或请求超时' })
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw createError({
      statusCode: res.status,
      statusMessage: `自定义远端 API 错误：${detail.slice(0, 200) || `上游返回 ${res.status}`}`,
    })
  }

  const json: any = await res.json().catch(() => ({}))
  const data: any[] = Array.isArray(json?.data) ? json.data : []
  if (!data.length) {
    throw createError({ statusCode: 502, statusMessage: '自定义远端 API 未返回图片数据' })
  }

  const images: { base64: string; mediaType: string }[] = []
  const originalUrls: string[] = []
  for (const item of data) {
    if (typeof item?.url === 'string' && item.url) {
      originalUrls.push(item.url)
      const downloaded = await downloadImage(item.url)
      if (downloaded) images.push(downloaded)
      continue
    }
    if (typeof item?.b64_json === 'string' && item.b64_json) {
      const mediaType = 'image/png'
      const id = cacheRemoteImage(item.b64_json, mediaType)
      originalUrls.push(`${VIEW_PATH}?id=${encodeURIComponent(id)}`)
      images.push({ base64: item.b64_json, mediaType })
    }
  }
  if (!originalUrls.length) {
    throw createError({ statusCode: 502, statusMessage: '自定义远端 API 返回的图片格式无法识别' })
  }

  return { images, originalUrls }
}

import { randomUUID } from 'node:crypto'
import { getRemoteImage } from './remote'
import { resolveTemplate } from './templates'

// 本机 ComfyUI 生图 provider，复用 /api/image 现有的 provider 契约。
// 官方 HTTP API 参考：https://docs.comfy.org/zh/development/comfyui-server/api-examples.md
// 仅支持与 Nuxt 服务端同机运行的 ComfyUI Desktop，默认 http://127.0.0.1:8188，无需 API Key。
// 工作流来自服务端内置预制模板：文生图两套、图像编辑一套。
// 其中的 ComfyUI HTTP 工具也供视频侧图生视频 provider 复用。

export const DEFAULT_COMFY_BASE = 'http://127.0.0.1:8188'

const VIEW_PATH = '/api/image/comfy/view'
const REMOTE_VIEW_PATH = '/api/image/remote/view'
const POLL_INTERVAL_MS = 1000
const POLL_TIMEOUT_MS = 5 * 60 * 1000
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024

interface ComfyImage {
  filename: string
  subfolder: string
  type: string
}

interface ComfyBody {
  prompt: string
  model: { provider?: string; name?: string; apiKey?: string; baseURL?: string }
  task?: string
  template?: string
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

function parseSize(size?: string): { width?: number; height?: number } {
  const match = /^(\d{2,4})[x×](\d{2,4})$/i.exec(String(size ?? '').trim())
  if (!match) return {}
  // ComfyUI 的 latent 尺寸需为 8 的倍数
  const normalize = (v: number) => Math.min(Math.max(Math.round(v / 8) * 8, 64), 2048)
  return { width: normalize(Number(match[1])), height: normalize(Number(match[2])) }
}

// 提示词槽位常见字段名，仅写入值为字符串的槽位
const PROMPT_KEYS = ['prompt', 'text', 'positive_prompt', 'value', 'string']
// 负向、系统提示词与开关的非默认分支，追溯连线时跳过
const SKIP_KEYS = ['negative', 'negative_prompt', 'negative_text', 'system_prompt', 'system', 'notes', 'on_true']

// 从采样器/引导器的正向条件出发，沿连线找到真正存放提示词文本的节点
function resolvePromptSlot(workflow: Record<string, any>): { node: any; key: string } | null {
  const startIds: string[] = []
  for (const node of Object.values(workflow) as any[]) {
    for (const key of ['positive', 'conditioning']) {
      const ref = node?.inputs?.[key]
      if (Array.isArray(ref)) startIds.push(String(ref[0]))
    }
  }

  const visited = new Set<string>()
  const queue = [...startIds]
  while (queue.length) {
    const id = queue.shift()!
    if (visited.has(id)) continue
    visited.add(id)
    const node: any = workflow[id]
    const inputs = node?.inputs
    if (!inputs) continue

    // 开关节点只有当前生效分支会执行，优先定位到该分支
    const activeKey = typeof inputs.switch === 'boolean' ? (inputs.switch ? 'on_true' : 'on_false') : null
    if (activeKey && typeof inputs[activeKey] === 'string') return { node, key: activeKey }
    for (const key of PROMPT_KEYS) {
      if (typeof inputs[key] === 'string' && !SKIP_KEYS.includes(key)) return { node, key }
    }

    if (activeKey) {
      const ref = inputs[activeKey]
      if (Array.isArray(ref)) queue.push(String(ref[0]))
      continue
    }
    for (const [key, value] of Object.entries(inputs) as [string, any][]) {
      if (SKIP_KEYS.includes(key) || key === 'on_false') continue
      if (Array.isArray(value)) queue.push(String(value[0]))
    }
  }
  return null
}

// 按节点类型注入参数，兼容任意 API 格式工作流
function applyWorkflowParams(
  workflow: Record<string, any>,
  options: { prompt: string; width?: number; height?: number; batchSize?: number; seed: number },
): void {
  const { prompt, width, height, batchSize, seed } = options
  const values = Object.values(workflow) as any[]

  const slot = resolvePromptSlot(workflow)
  if (!slot) {
    const types = [...new Set(values.map((node) => String(node?.class_type ?? '?')))].slice(0, 8).join('、')
    throw createError({
      statusCode: 400,
      statusMessage: `工作流中未找到可写入提示词的文本节点（当前节点类型：${types}），请确认工作流包含正向提示词输入`,
    })
  }
  slot.node.inputs[slot.key] = prompt

  for (const node of values) {
    const inputs = node?.inputs
    if (!inputs) continue
    // 采样器、随机噪声与文本生成节点共用同一个种子
    for (const [key, value] of Object.entries(inputs) as [string, any][]) {
      const isSeedKey = key === 'seed' || key === 'noise_seed' || key.endsWith('.seed')
      if (isSeedKey && typeof value === 'number') inputs[key] = seed
    }
    const type = String(node.class_type ?? '')
    if (type.startsWith('Empty') && type.includes('LatentImage')) {
      // 尺寸由上游节点（如 ResolutionSelector）提供时不覆盖连线
      if (width && typeof inputs.width === 'number') inputs.width = width
      if (height && typeof inputs.height === 'number') inputs.height = height
      if (batchSize && typeof inputs.batch_size === 'number') inputs.batch_size = batchSize
    }
  }
}

// /prompt 校验失败时把节点级错误（常见为模型文件缺失）展开成可读提示
function formatNodeErrors(nodeErrors: any): string {
  const entries = Object.entries(nodeErrors ?? {}) as [string, any][]
  return entries
    .map(([id, value]) => {
      const first = Array.isArray(value?.errors) ? value.errors[0] : undefined
      const reason = first?.message || first?.details || '校验失败'
      return `${id} ${String(value?.class_type ?? '')}：${String(reason).slice(0, 160)}`
    })
    .join('；')
}

async function submitPrompt(base: string, workflow: Record<string, any>): Promise<string> {
  const res = await comfyFetch(base, '/prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: workflow, client_id: randomUUID() }),
  })
  const json: any = await res.json()
  if (json?.error) {
    const detail = formatNodeErrors(json.node_errors)
    const suffix = detail ? `（${detail}）` : ''
    throw createError({ statusCode: 400, statusMessage: `ComfyUI 拒绝工作流：${json.error}${suffix}` })
  }
  if (!json?.prompt_id) {
    throw createError({ statusCode: 502, statusMessage: 'ComfyUI 未返回 prompt_id，无法查询生成结果' })
  }
  return String(json.prompt_id)
}

function collectImages(outputs: any, workflow?: Record<string, any>): ComfyImage[] {
  const images: ComfyImage[] = []
  for (const [nodeId, node] of Object.entries(outputs ?? {}) as [string, any][]) {
    // 只收集保存节点的输出，避免 ImageCompare 等 UI 节点被误收
    if (workflow && !String(workflow[nodeId]?.class_type ?? '').startsWith('SaveImage')) continue
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
  const hint = '请确认本机已安装工作流所需模型，且节点配置与当前 ComfyUI 版本匹配'
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
async function waitForImages(base: string, promptId: string, workflow: Record<string, any>): Promise<ComfyImage[]> {
  const deadline = Date.now() + POLL_TIMEOUT_MS
  while (Date.now() < deadline) {
    const res = await comfyFetch(base, `/history/${encodeURIComponent(promptId)}`)
    const history: any = await res.json()
    const item = history?.[promptId]
    if (item?.status?.status_str === 'error') {
      throw createError({ statusCode: 502, statusMessage: formatExecutionError(item) })
    }
    const images = collectImages(item?.outputs, workflow)
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

interface InputImage {
  buffer: Buffer
  filename: string
  mediaType: string
}

function extensionOf(mediaType: string): string {
  const subtype = mediaType.split('/')[1]?.split(';')[0]?.toLowerCase() ?? 'png'
  return subtype === 'jpeg' ? 'jpg' : subtype
}

function checkedInputImage(result: InputImage): InputImage {
  if (!result.buffer.length) {
    throw createError({ statusCode: 400, statusMessage: '患者头像内容为空，请重新生成头像' })
  }
  if (result.buffer.length > MAX_UPLOAD_BYTES) {
    throw createError({ statusCode: 400, statusMessage: '患者头像超过 20MB 限制，请重新生成头像' })
  }
  if (!result.mediaType.startsWith('image/')) {
    throw createError({ statusCode: 400, statusMessage: '患者头像不是有效的图片' })
  }
  return result
}

// 图像编辑：把患者头像（同源代理 URL / 远程 URL / data URL）统一解析为二进制
async function resolveInputImage(base: string, image?: string): Promise<InputImage> {
  const source = String(image ?? '').trim()
  if (!source) {
    throw createError({
      statusCode: 400,
      statusMessage: '缺少患者头像，请先在「图像创作」中生成（用作图像编辑输入图或视频首帧）',
    })
  }

  if (source.startsWith('data:')) {
    const match = /^data:(image\/[\w.+-]+);base64,([\w+/=]+)$/i.exec(source)
    if (!match) {
      throw createError({ statusCode: 400, statusMessage: '患者头像的 data URL 格式非法' })
    }
    return checkedInputImage({
      buffer: Buffer.from(match[2], 'base64'),
      filename: `urdoc-avatar.${extensionOf(match[1])}`,
      mediaType: match[1],
    })
  }

  // 头像由自定义远端图像 API 返回时是同源短 URL（进程内缓存），直接读取避免自请求
  if (source.includes(REMOTE_VIEW_PATH)) {
    const query = new URLSearchParams(source.split('?')[1] ?? '')
    const cached = getRemoteImage(query.get('id') || '')
    if (!cached) {
      throw createError({ statusCode: 400, statusMessage: '患者头像缓存已失效，请重新生成头像' })
    }
    return checkedInputImage({
      buffer: cached.buffer,
      filename: `urdoc-avatar.${extensionOf(cached.mediaType)}`,
      mediaType: cached.mediaType,
    })
  }

  // 头像由本地 ComfyUI 生成时是同源代理 URL，直接解析 query 取回，避免自请求
  if (source.includes(VIEW_PATH)) {
    const query = new URLSearchParams(source.split('?')[1] ?? '')
    const filename = query.get('filename') || ''
    if (!filename) {
      throw createError({ statusCode: 400, statusMessage: '患者头像地址缺少文件名，请重新生成头像' })
    }
    const upstreamBase = normalizeComfyBase(String(query.get('base') || '')) || base
    const params = new URLSearchParams({
      filename,
      subfolder: query.get('subfolder') || '',
      type: query.get('type') || 'output',
    })
    const res = await comfyFetch(upstreamBase, `/view?${params.toString()}`)
    return checkedInputImage({
      buffer: Buffer.from(await res.arrayBuffer()),
      filename,
      mediaType: res.headers.get('content-type') || 'image/png',
    })
  }

  let parsed: URL
  try {
    parsed = new URL(source)
  } catch {
    throw createError({ statusCode: 400, statusMessage: '患者头像地址格式非法' })
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw createError({ statusCode: 400, statusMessage: '患者头像地址仅支持 http/https' })
  }
  let res: Response
  try {
    res = await fetch(parsed.href)
  } catch {
    throw createError({ statusCode: 502, statusMessage: '患者头像下载失败，请检查可访问性' })
  }
  if (!res.ok) {
    throw createError({ statusCode: 502, statusMessage: `患者头像下载失败（上游返回 ${res.status}）` })
  }
  return checkedInputImage({
    buffer: Buffer.from(await res.arrayBuffer()),
    filename: parsed.pathname.split('/').pop() || 'urdoc-avatar.png',
    mediaType: res.headers.get('content-type') || 'image/png',
  })
}

async function uploadInputImage(base: string, input: InputImage): Promise<string> {
  const form = new FormData()
  form.append('image', new Blob([new Uint8Array(input.buffer)], { type: input.mediaType }), input.filename)
  form.append('overwrite', 'true')
  const res = await comfyFetch(base, '/upload/image', { method: 'POST', body: form })
  const json: any = await res.json().catch(() => ({}))
  const name = String(json?.name ?? '')
  if (!name) {
    throw createError({ statusCode: 502, statusMessage: 'ComfyUI 上传患者头像失败：未返回文件名' })
  }
  const subfolder = String(json?.subfolder ?? '')
  return subfolder ? `${subfolder}/${name}` : name
}

function injectLoadImage(workflow: Record<string, any>, name: string): void {
  let injected = 0
  for (const node of Object.values(workflow) as any[]) {
    if (node?.class_type === 'LoadImage') {
      node.inputs.image = name
      injected++
    }
  }
  if (!injected) {
    throw createError({ statusCode: 400, statusMessage: '工作流模板中未找到 LoadImage 节点，无法写入患者头像或视频首帧' })
  }
}

export async function handle(body: ComfyBody): Promise<ImageResult> {
  const { prompt, model, n, size, seed, task, template } = body
  // 故事插图使用图像编辑模板（以患者头像为输入图），其余任务使用文生图模板
  if (!prompt) {
    throw createError({ statusCode: 400, statusMessage: 'prompt 不能为空' })
  }

  const base = normalizeComfyBase(String(model?.baseURL ?? ''))
  const workflowTask = task === 'illustration' ? 'edit' : 't2i'
  const workflow = resolveTemplate(template, workflowTask)
  const { width, height } = parseSize(size)
  const nValue = Number(n)
  const batchSize = Number.isFinite(nValue) && nValue > 0 ? Math.min(Math.max(Math.floor(nValue), 1), 4) : undefined
  const workflowSeed = Number.isFinite(seed) ? Math.floor(Number(seed)) : Math.floor(Math.random() * 2 ** 31)
  applyWorkflowParams(workflow, { prompt, width, height, batchSize, seed: workflowSeed })

  // 图像编辑先上传患者头像，再把文件名写入所有 LoadImage 节点
  if (workflowTask === 'edit') {
    const input = await resolveInputImage(base, body.image)
    const uploadedName = await uploadInputImage(base, input)
    injectLoadImage(workflow, uploadedName)
  }

  const promptId = await submitPrompt(base, workflow)
  const images = await waitForImages(base, promptId, workflow)

  // useImageApi 允许 images 为空，imageStore 只消费 originalUrls
  return { images: [], originalUrls: images.map((img) => buildViewUrl(base, img)) }
}

// 视频侧图生视频 provider 复用本机地址校验、输入图上传与 /prompt 提交等工具
export {
  comfyFetch,
  formatExecutionError,
  injectLoadImage,
  resolveInputImage,
  submitPrompt,
  uploadInputImage,
}

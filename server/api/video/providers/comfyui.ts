import {
  comfyFetch,
  formatExecutionError,
  injectLoadImage,
  normalizeComfyBase,
  resolveInputImage,
  submitPrompt,
  uploadInputImage,
} from '../../image/providers/comfyui'
import { resolveVideoTemplate } from './templates'

// 本机 ComfyUI 图生视频 provider。
// 复用图像侧的 ComfyUI HTTP 工具（本机地址校验、首帧上传、/prompt 提交），
// 但保留 /api/video 的 create → query 异步契约：create 提交工作流返回 prompt_id，
// query 轮询 /history 直到 SaveVideo 产出视频，再通过同源代理地址返回给前端。

const VIEW_PATH = '/api/video/comfy/view'
const PROMPT_PLACEHOLDER = '{{URDOC_PROMPT}}'
const VIDEO_EXT = /\.(mp4|webm|mov|mkv|avi|m4v|gif)$/i

interface ComfyVideoBody {
  task: string
  model: { provider?: string; name?: string; apiKey?: string; baseURL?: string }
  prompt?: string
  image?: string
  taskId?: string
  template?: string
  num_frames?: number
  frame_rate?: number
  seed?: number
}

interface ComfyVideo {
  filename: string
  subfolder: string
  type: string
}

// 提示词槽位保留模板里「<Picture 1> 作为首帧被完全引用」的固定前缀，只替换占位符
function injectPrompt(workflow: Record<string, any>, prompt: string): void {
  let injected = 0
  for (const node of Object.values(workflow) as any[]) {
    if (typeof node?.inputs?.prompt !== 'string') continue
    node.inputs.prompt = node.inputs.prompt.includes(PROMPT_PLACEHOLDER)
      ? node.inputs.prompt.split(PROMPT_PLACEHOLDER).join(prompt)
      : prompt
    injected++
  }
  if (!injected) {
    throw createError({
      statusCode: 400,
      statusMessage: '本地图生视频模板中未找到可写入提示词的节点，请检查工作流',
    })
  }
}

function applyVideoParams(
  workflow: Record<string, any>,
  options: { prompt: string; num_frames?: number; frame_rate?: number; seed?: number },
): void {
  const { prompt, num_frames, frame_rate, seed } = options
  injectPrompt(workflow, prompt)

  const workflowSeed = Number.isFinite(seed) ? Math.floor(Number(seed)) : Math.floor(Math.random() * 2 ** 31)
  // 工作流以时长（秒）驱动表达式计算总帧数；最短 5 秒由表达式自身保证
  const fps = Number(frame_rate) > 0 ? Number(frame_rate) : 24
  const frames = Number(num_frames)
  const duration = Number.isFinite(frames) && frames > 0 ? Math.max(5, Math.round(frames / fps)) : undefined

  for (const node of Object.values(workflow) as any[]) {
    const inputs = node?.inputs
    if (!inputs) continue
    for (const [key, value] of Object.entries(inputs) as [string, any][]) {
      const isSeedKey = key === 'seed' || key === 'noise_seed' || key.endsWith('.seed')
      if (isSeedKey && typeof value === 'number') inputs[key] = workflowSeed
    }
    // 只改标注为 duration 的数值节点，避免误改工作流里的其它常量
    const isDurationNode =
      /^Primitive(Float|Int)$/.test(String(node.class_type ?? '')) &&
      /duration/i.test(String(node?._meta?.title ?? ''))
    if (duration && isDurationNode && typeof inputs.value === 'number') inputs.value = duration
  }
}

// SaveVideo 在不同 ComfyUI 版本里可能把文件放在 videos / images / gifs 字段，按扩展名统一收集
function collectVideos(outputs: any): ComfyVideo[] {
  const videos: ComfyVideo[] = []
  const seen = new Set<string>()
  for (const node of Object.values(outputs ?? {}) as any[]) {
    for (const key of ['videos', 'images', 'gifs']) {
      const list = Array.isArray(node?.[key]) ? node[key] : []
      for (const item of list as any[]) {
        const filename = String(item?.filename ?? '')
        if (!filename || !VIDEO_EXT.test(filename)) continue
        const subfolder = String(item?.subfolder ?? '')
        const type = String(item?.type ?? 'output')
        const id = `${type}/${subfolder}/${filename}`
        if (seen.has(id)) continue
        seen.add(id)
        videos.push({ filename, subfolder, type })
      }
    }
  }
  return videos
}

// 交给同源代理取视频，前端只保存短相对 URL，避免把大文件写进 localStorage
function buildViewUrl(base: string, video: ComfyVideo): string {
  const segments = video.filename.split('/')
  const filename = segments.pop() || video.filename
  const subfolder = [video.subfolder, ...segments].filter(Boolean).join('/')
  const params = new URLSearchParams({ base, filename, subfolder, type: video.type })
  return `${VIEW_PATH}?${params.toString()}`
}

async function createVideo(base: string, body: ComfyVideoBody) {
  const { prompt, image, num_frames, frame_rate, seed, template } = body
  if (!prompt) {
    throw createError({ statusCode: 400, statusMessage: 'prompt 不能为空' })
  }

  const workflow = resolveVideoTemplate(template)
  applyVideoParams(workflow, { prompt, num_frames, frame_rate, seed })

  // 以已生成的患者头像作为首帧：上传后写入工作流的所有 LoadImage 节点
  const input = await resolveInputImage(base, image)
  const uploadedName = await uploadInputImage(base, input)
  injectLoadImage(workflow, uploadedName)

  const promptId = await submitPrompt(base, workflow)
  return { taskId: promptId, status: 'processing', progress: 0 }
}

async function queryVideo(base: string, body: ComfyVideoBody) {
  const taskId = String(body.taskId ?? '').trim()
  if (!taskId) {
    throw createError({ statusCode: 400, statusMessage: '查询本地视频任务时 taskId 不能为空' })
  }

  const res = await comfyFetch(base, `/history/${encodeURIComponent(taskId)}`)
  const history: any = await res.json()
  const item = history?.[taskId]
  if (!item) return { taskId, status: 'processing', progress: 0 }

  if (item?.status?.status_str === 'error') {
    throw createError({ statusCode: 502, statusMessage: formatExecutionError(item) })
  }

  const videos = collectVideos(item?.outputs)
  if (videos.length) {
    return { taskId, status: 'completed', progress: 100, video_url: buildViewUrl(base, videos[0]) }
  }
  if (item?.status?.completed) {
    throw createError({
      statusCode: 502,
      statusMessage: 'ComfyUI 已完成执行但未返回视频，请检查工作流的 SaveVideo 输出节点',
    })
  }
  return { taskId, status: 'processing', progress: 0 }
}

export async function handle(body: ComfyVideoBody) {
  const { task, model } = body
  if (!task) {
    throw createError({ statusCode: 400, statusMessage: 'task 不能为空（create 或 query）' })
  }
  const base = normalizeComfyBase(String(model?.baseURL ?? ''))
  if (task === 'create') return createVideo(base, body)
  if (task === 'query') return queryVideo(base, body)
  throw createError({ statusCode: 400, statusMessage: `未知 task: ${task}，仅支持 create 和 query` })
}

import { DEFAULT_COMFY_BASE, normalizeComfyBase } from '../../image/providers/comfyui'

// 同源视频代理：把本机 ComfyUI 的 /view 视频转发成同源响应，并转发 Range 请求以支持拖动进度条。
// 与图像侧一样严格限制为本机来源，避免 baseURL 被当作任意地址使用。
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const base = normalizeComfyBase(String(query.base || DEFAULT_COMFY_BASE))
  const filename = String(query.filename || '')
  const subfolder = String(query.subfolder || '')
  const type = String(query.type || 'output')

  if (!filename || filename.includes('..') || /[/\\]/.test(filename)) {
    throw createError({ statusCode: 400, statusMessage: '视频文件名非法' })
  }
  if (subfolder.includes('..') || /\\/.test(subfolder) || subfolder.startsWith('/')) {
    throw createError({ statusCode: 400, statusMessage: '视频子目录非法' })
  }
  if (!['output', 'input', 'temp'].includes(type)) {
    throw createError({ statusCode: 400, statusMessage: '视频类型非法' })
  }

  const params = new URLSearchParams({ filename, subfolder, type })
  const range = getRequestHeader(event, 'range')
  let res: Response
  try {
    res = await fetch(`${base}/view?${params.toString()}`, {
      headers: range ? { Range: range } : undefined,
    })
  } catch {
    throw createError({ statusCode: 502, statusMessage: '无法连接本机 ComfyUI 获取视频，请确认服务已启动' })
  }
  if (!res.ok) {
    throw createError({ statusCode: 502, statusMessage: `ComfyUI 视频读取失败（上游返回 ${res.status}）` })
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  setResponseStatus(event, res.status)
  setHeader(event, 'Content-Type', res.headers.get('content-type') || 'video/mp4')
  for (const name of ['content-range', 'accept-ranges', 'content-length']) {
    const value = res.headers.get(name)
    if (value) setHeader(event, name, value)
  }
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return buffer
})

import { DEFAULT_COMFY_BASE, normalizeComfyBase } from '../providers/comfyui'

// 同源图片代理：把本机 ComfyUI 的 /view 图片转发成同源响应。
// originalUrls 只保存短相对 URL，避免 base64 撑爆 localStorage；
// 同源图片也能被截图导出（snapdom）直接内联，不会污染 canvas。
// 现有 /api/image/proxy 明确拒绝内网地址，因此这里单独实现并严格限制为本机来源。
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const base = normalizeComfyBase(String(query.base || DEFAULT_COMFY_BASE))
  const filename = String(query.filename || '')
  const subfolder = String(query.subfolder || '')
  const type = String(query.type || 'output')

  if (!filename || filename.includes('..') || /[/\\]/.test(filename)) {
    throw createError({ statusCode: 400, statusMessage: '图片文件名非法' })
  }
  if (subfolder.includes('..') || /\\/.test(subfolder) || subfolder.startsWith('/')) {
    throw createError({ statusCode: 400, statusMessage: '图片子目录非法' })
  }
  if (!['output', 'input', 'temp'].includes(type)) {
    throw createError({ statusCode: 400, statusMessage: '图片类型非法' })
  }

  const params = new URLSearchParams({ filename, subfolder, type })
  let res: Response
  try {
    res = await fetch(`${base}/view?${params.toString()}`)
  } catch {
    throw createError({ statusCode: 502, statusMessage: '无法连接本机 ComfyUI 获取图片，请确认服务已启动' })
  }
  if (!res.ok) {
    throw createError({ statusCode: 502, statusMessage: `ComfyUI 图片读取失败（上游返回 ${res.status}）` })
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  setHeader(event, 'Content-Type', res.headers.get('content-type') || 'image/png')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return buffer
})

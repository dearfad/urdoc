import { getRemoteImage } from '../providers/remote'

// 同源图片端点：为只返回 b64_json 的自定义远端 API 提供可持久化的短 URL。
// 图片仅缓存在进程内，服务重启后需重新生成，这是保证 originalUrls 不含 base64 的兜底方案。
export default defineEventHandler((event) => {
  const id = String(getQuery(event).id || '')
  const entry = getRemoteImage(id)
  if (!entry) {
    throw createError({ statusCode: 404, statusMessage: '图片缓存已失效，请重新生成图片' })
  }
  setHeader(event, 'Content-Type', entry.mediaType)
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return entry.buffer
})

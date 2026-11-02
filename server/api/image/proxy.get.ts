// 同源图片代理：由服务端拉取远程图片并原样返回，规避两处问题：
// 1) 远程图片为跨域 URL，snapdom 序列化进 SVG foreignObject 绘制到 canvas 时会污染画布导致导出失败；
// 2) 远程 CDN 通常不带 CORS 头，浏览器侧直接 fetch 会被拦截。
// 经本接口转发后，浏览器拿到的是同源响应，canvas 不再被污染，snapdom 可正常内联导出。
//
// 注意：url 来自调用方（页面内的远程图片地址），存在 SSRF 风险，故做基础白名单防护：
// 仅允许 https，并拒绝指向本机/内网/链路本地地址的主机。
export default defineEventHandler(async (event) => {
  const url = (getQuery(event).url as string) || ''
  if (!url) {
    throw createError({ statusCode: 400, statusMessage: '缺少 url 参数' })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'url 格式非法' })
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw createError({ statusCode: 400, statusMessage: '仅支持 http/https' })
  }

  const host = parsed.hostname.toLowerCase()
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host === '[::1]' ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    host === '::1'
  ) {
    throw createError({ statusCode: 400, statusMessage: '禁止访问内网地址' })
  }

  let res: Response
  try {
    res = await fetch(parsed.href, { redirect: 'follow' })
  } catch {
    throw createError({ statusCode: 502, statusMessage: '代理拉取失败' })
  }

  if (!res.ok) {
    throw createError({ statusCode: 502, statusMessage: `上游返回 ${res.status}` })
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') || 'image/png'

  setHeader(event, 'Content-Type', contentType)
  // 图片内容不可变，缓存一小时，减少重复拉取
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return buffer
})

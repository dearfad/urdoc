import { unmask } from './mask.js'
export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  // 添加 API Key 到 Authorization 头
  const apiKey = params.apiKey
    ? unmask(process.env['NUXT_URDOC_SECRET_KEY'], params.apiKey)
    : process.env[params.apiKeyName]
  params.headers.Authorization = `Bearer ${apiKey}`
  // 直接转发请求并返回响应
  return fetch(params.url, {
    method: params.method,
    headers: params.headers,
    body: params.body,
  })
})

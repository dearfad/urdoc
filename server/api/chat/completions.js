export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  // 添加 API Key 到 Authorization 头
  params.headers.Authorization = `Bearer ${process.env[params.apiKeyName]}`
  // 直接转发请求并返回响应
  return fetch(params.url, {
    method: params.method,
    headers: params.headers,
    body: params.body,
  })
})

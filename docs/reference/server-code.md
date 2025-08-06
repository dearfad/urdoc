# 服务器代码

## EdgeOne Pages Function

- /functions/function/proxy/fetch.js

```js
export async function onRequest({ request, env }) {
  const { params } = await request.json()
  // 删除 accept-encoding 头避免压缩影响 SSE 流
  request.headers.delete('accept-encoding')
  // 添加 API Key 到 Authorization 头
  params.headers.Authorization = `Bearer ${env[params.apiKeyName]}`
  // 直接转发请求并返回响应
  return fetch(params.url, {
    method: params.method,
    headers: params.headers,
    body: params.body,
  })
}
```

## NUXT -> Vercel, Netlify

- /server/api/proxy/fetch.js

```js
export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)
  // 添加 API Key 到 Authorization 头
  params.headers.Authorization = `Bearer ${process.env[params.apiKeyName]}`
  // 直接转发请求并返回响应
  return await fetch(params.url, {
    method: params.method,
    headers: params.headers,
    body: params.body,
  })
})
```

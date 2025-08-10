# 服务器代码

## 功能

- 通过后端环境获取 API Key，并添加到请求头中访问大模型，预防 API Key 泄漏

## EdgeOne Pages Function

- /functions/function/fetch.js

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

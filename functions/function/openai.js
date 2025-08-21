import OpenAI from 'openai'
export async function onRequest({ request, env }) {
  const { params } = await request.json()
  // 删除 accept-encoding 头避免压缩影响 SSE 流
  request.headers.delete('accept-encoding')
  // 初始化 OpenAI 客户端
  const client = new OpenAI({
    baseURL: params.url,
    apiKey: env[params.apiKeyName],
  })

  return client.chat.completions.create({
    model: params.body.model,
    messages: params.body.messages,
    stream: true,
  })
}

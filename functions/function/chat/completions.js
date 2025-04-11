export async function onRequest({ request, env }) {
  const { params } = await request.json()
  const providerApiKey = env[params.model.key.provider]
  const gatewayApiKey = env[params.model.key.gateway]
  const model = params.model

  // 定义不同 gateway 的请求配置
  const fetchConfigs = {
    EdgeOne: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + providerApiKey,
        'OE-Gateway-Version': 2,
        'OE-Key': gatewayApiKey,
        'OE-Gateway-Name': 'urdoc',
        'OE-AI-Provider': 'ali',
      },
      body: JSON.stringify({
        model: model.id,
        messages: params.messages,
        response_format: params.responseFormat,
        stream: true,
      }),
    },
    OpenRouter: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + gatewayApiKey,
      },
      body: JSON.stringify({
        model: model.id,
        messages: params.messages,
        stream: true,
      }),
    },
    default: {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + providerApiKey,
      },
      body: JSON.stringify({
        model: model.id,
        messages: params.messages,
        response_format: params.responseFormat,
        stream: true,
      }),
    },
  }

  // 根据 model.gateway 选择对应的配置
  const fetchConfig = fetchConfigs[params.model.gateway] || fetchConfigs.default

  const response = await fetch(model.url, {
    method: 'POST',
    ...fetchConfig,
  })

  return new Response(response.body, {
    headers: {
      'Transfer-Encoding': 'chunked',
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

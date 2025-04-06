export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    })
  }
  request.headers.delete('accept-encoding')
  const { params } = await request.clone().json()
  const model = params.models.chatModel
  const gatewayApiKey = env[model.envGatewayApiKeyName]
  const providerApiKey = env[model.envProviderApiKeyName]
  let stream = ''
  switch (model.gateway) {
    case 'EdgeOne':
      stream = await fetch(model.url, {
        method: 'POST',
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
          // temperature: 0.95,
          // top_p: 0.7,
          // max_tokens: 1024,
        }),
      })
      break
    case 'OpenRouter':
      stream = await fetch(model.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + gatewayApiKey,
        },
        body: JSON.stringify({
          model: model.id,
          messages: params.messages,
          response_format: params.responseFormat,
          stream: true,
        }),
      })
      break
    default:
      stream = await fetch(model.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + providerApiKey,
        },
        body: JSON.stringify({
          model: model.id,
          messages: params.messages,
          response_format: params.responseFormat,
          stream: true,
          // temperature: 0.95,
          // top_p: 0.7,
          // max_tokens: 1024,
        }),
      })
  }

  return new Response(stream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

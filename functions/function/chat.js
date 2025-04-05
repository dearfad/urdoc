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
  const providerApiKey = env[model.envProviderApiKeyName]

  const stream = await fetch(model.url, {
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

  const responseStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      const reader = stream.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = new TextDecoder().decode(value)
        const lines = text.split('\n\n')
        lines.forEach((line) => {
          if (line === '') return
          controller.enqueue(encoder.encode(line + '\n\n'))
        })
      }
    },
  })

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      // 'Transfer-Encoding': 'chunked',
      // 'Accept-Encoding': '',
      // 'Content-Encoding': '',
    },
  })
}

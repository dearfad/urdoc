export async function onRequest({ request, env }) {
  const { params } = await request.json()
  const apiKey = env[params.model.key.provider]
  const response = await fetch(params.model.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model: params.model.id,
      messages: params.messages,
      stream: true,
    }),
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

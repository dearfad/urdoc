export async function onRequest({ request, env }) {
  const params = await request.json()
  const apiKey = env[params.apiKey]
  return await fetch(params.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model: params.model,
      messages: params.messages,
      stream: false,
    }),
  })
}

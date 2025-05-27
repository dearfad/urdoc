export async function onRequest({ request, env }) {
  const { params } = await request.json()
  const headers = params.headers
  const body = params.body
  const apiKeyValue = env[params.apiKeyName]
  headers.Authorization += apiKeyValue
  return await fetch(params.url, {
    method: 'POST',
    headers: headers,
    body: body,
  })
}

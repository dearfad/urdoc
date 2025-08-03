export async function onRequest({ request, env }) {
  const { params } = await request.json()
  request.headers.delete('accept-encoding')
  params.headers.Authorization += env[params.apiKey]
  return await fetch(params.url, {
    method: 'POST',
    headers: params.headers,
    body: params.body,
  })
}

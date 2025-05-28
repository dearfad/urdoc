export async function onRequest({ request, env }) {
  const { params } = await request.json()
  params.headers.Authorization += env[params.apiKey]
  const response = await fetch(params.url, {
    method: 'POST',
    headers: params.headers,
    body: params.body,
  })
  return new Response(response.body, {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

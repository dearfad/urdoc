export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
  }
  const { params } = await request.json()
  params.headers.Authorization += env[params.apiKey]
  // return await fetch(params.url, {
  //   method: 'POST',
  //   headers: params.headers,
  //   body: params.body,
  // })

  const upstream = await fetch(params.url, {
    method: 'POST',
    headers: params.headers,
    body: params.body,
  })
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'text/event-stream',
  }
  return new Response(upstream.body, {
    status: upstream.status,
    headers: corsHeaders,
  })
}

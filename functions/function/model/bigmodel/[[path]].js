import { unmask } from '../../utils/mask.js'
const PATH_PREFIX = '/function/model/bigmodel'
export async function onRequest({ request, env }) {
  const { pathname } = new URL(request.url)
  const route = pathname.slice(PATH_PREFIX.length) || '/'

  if (route.startsWith('/chat')) return chatCompletions(request, env)

  // TODO: error handling
  return new Response(JSON.stringify(route))
}

async function chatCompletions(request, env) {
  request.headers.delete('accept-encoding')
  const { params } = await request.json()
  const apiKey = params.apiKey
    ? unmask(env['NUXT_URDOC_SECRET_KEY'], params.apiKey)
    : env[params.apiKeyName]
  params.headers.Authorization = `Bearer ${apiKey}`
  const response = await fetch(params.url, {
    method: 'POST',
    headers: params.headers,
    body: params.body,
  })
  return streamResponse(response)
}

function streamResponse(response) {
  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
      'Cache-Control': 'no-store',
    },
  })
}

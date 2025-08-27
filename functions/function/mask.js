export async function onRequest({ request, env }) {
  const { params } = await request.json()
  const maskKey = env['NUXT_URDOC_SECRET_KEY']
  const apiKey = params.apiKey
  return new Response(params.mask ? mask(maskKey, apiKey) : unmask(maskKey, apiKey))
}

export const mask = (maskKey, apiKey) => btoa(maskKey + apiKey)
export const unmask = (maskKey, maskedApiKey) => atob(maskedApiKey).slice(maskKey.length)

export async function onRequest({ request, env }) {
  const { payload } = await request.json()
  const maskKey = env['NUXT_URDOC_SECRET_KEY']
  const apiKey = payload.apiKey
  return new Response(payload.mask ? mask(maskKey, apiKey) : unmask(maskKey, apiKey))
}

export const mask = (maskKey, apiKey) => btoa(maskKey + apiKey)
export const unmask = (maskKey, maskedApiKey) => atob(maskedApiKey).slice(maskKey.length)

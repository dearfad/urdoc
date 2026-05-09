export default defineEventHandler(async (event) => {
  const { payload } = await readBody(event)
  const maskKey = process.env['NUXT_URDOC_SECRET_KEY']
  const apiKey = payload.apiKey
  return payload.mask ? mask(maskKey, apiKey) : unmask(maskKey, apiKey)
})

export const mask = (maskKey, apiKey) => btoa(maskKey + apiKey)
export const unmask = (maskKey, maskedApiKey) => atob(maskedApiKey).slice(maskKey.length)

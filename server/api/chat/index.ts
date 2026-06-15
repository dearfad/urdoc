import { handle as aisdk } from './providers/aisdk'

const handlers: Record<string, (body: any) => any> = {
  aisdk,
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const provider = body?.model?.provider
  if (!provider) {
    throw createError({
      statusCode: 400,
      statusMessage: `不支持的 provider: ${provider}`,
    })
  }
  const handler = handlers[provider] || handlers.aisdk
  return handler(body)
})

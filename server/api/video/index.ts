import { handle as agnes } from './providers/agnes'

const handlers: Record<string, (body: any) => any> = {
  agnes,
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const provider = body?.model?.provider?.toLowerCase()
  if (!provider || !handlers[provider]) {
    throw createError({
      statusCode: 400,
      statusMessage: `不支持的 provider: ${provider}`,
    })
  }
  return handlers[provider](body)
})

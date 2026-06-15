import { handle as xiaomi } from './providers/xiaomi'
import { handle as gitee } from './providers/gitee'

const handlers: Record<string, (body: any) => any> = {
  xiaomi,
  gitee,
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const provider = body?.model?.provider
  if (!provider || !handlers[provider]) {
    throw createError({
      statusCode: 400,
      statusMessage: `不支持的 provider: ${provider}`,
    })
  }
  return handlers[provider](body)
})

import { handle as aisdk } from './providers/aisdk'
import { handle as comfyui } from './providers/comfyui'

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
  // 对话场景的 Custom 模型命名为 ComfyUI 时走本机 ComfyUI 文本生成工作流；
  // 其它模型继续由 ai-sdk 按 OpenAI 兼容接口调用
  const isComfyUI =
    String(provider).toLowerCase() === 'custom' &&
    String(body?.model?.name ?? '').trim().toLowerCase() === 'comfyui'
  const handler = isComfyUI ? comfyui : handlers[provider] || handlers.aisdk
  return handler(body)
})

import { handle as bigmodel } from './providers/bigmodel'
import { handle as agnes } from './providers/agnes'
import { handle as comfyui } from './providers/comfyui'

const handlers: Record<string, (body: any) => any> = {
  bigmodel,
  agnes,
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const provider = body?.model?.provider?.toLowerCase()
  // 图像场景的 Custom 模型需命名为 ComfyUI 才走本机 ComfyUI 后端；
  // 对话场景的 Custom 仍由 /api/chat 走 ai-sdk，不受此处影响
  const isComfyUI = provider === 'custom' && String(body?.model?.name ?? '').trim().toLowerCase() === 'comfyui'
  const handler = isComfyUI ? comfyui : provider ? handlers[provider] : undefined
  if (!handler) {
    throw createError({
      statusCode: 400,
      statusMessage: `不支持的 provider: ${provider}`,
    })
  }
  return handler(body)
})

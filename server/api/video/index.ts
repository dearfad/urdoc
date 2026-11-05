import { handle as agnes } from './providers/agnes'
import { handle as comfyui } from './providers/comfyui'

const handlers: Record<string, (body: any) => any> = {
  agnes,
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const provider = body?.model?.provider?.toLowerCase()
  // 视频场景的 Custom 模型命名为 ComfyUI 时走本机 ComfyUI 图生视频工作流；
  // 其它名称的 Custom 模型沿用 /videos 协议，复用 agnes handler（baseURL / apiKey 均取自 model）
  const isComfyUI = provider === 'custom' && String(body?.model?.name ?? '').trim().toLowerCase() === 'comfyui'
  const handler = isComfyUI ? comfyui : provider === 'custom' ? agnes : provider ? handlers[provider] : undefined
  if (!handler) {
    throw createError({
      statusCode: 400,
      statusMessage: `不支持的 provider: ${provider}`,
    })
  }
  return handler(body)
})

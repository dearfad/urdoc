import { handle as bigmodel } from './providers/bigmodel'
import { handle as agnes } from './providers/agnes'
import { handle as comfyui } from './providers/comfyui'
import { handle as remote } from './providers/remote'

const handlers: Record<string, (body: any) => any> = {
  bigmodel,
  agnes,
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const provider = body?.model?.provider?.toLowerCase()
  // 图像场景的 Custom 模型需命名为 ComfyUI 才走本机 ComfyUI 后端；
  // 对话场景的同名 Custom 模型由 /api/chat 走本机 ComfyUI 文本生成，不受此处影响
  const isComfyUI = provider === 'custom' && String(body?.model?.name ?? '').trim().toLowerCase() === 'comfyui'
  // 其它名称的 Custom 模型走用户自建的远端 OpenAI 兼容图像 API
  const handler = isComfyUI ? comfyui : provider === 'custom' ? remote : provider ? handlers[provider] : undefined
  if (!handler) {
    throw createError({
      statusCode: 400,
      statusMessage: `不支持的 provider: ${provider}`,
    })
  }
  return handler(body)
})

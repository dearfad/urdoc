// 本地 ComfyUI 文本生成模板 ID：/api/chat 的所有调用点统一从这里注入。
// 由 app/utils 自动导入，无需逐个文件显式引入。

export const DEFAULT_CHAT_TEMPLATE = 'qwen3-text-gen'

export function getChatTemplate(model?: Model | null): string {
  const modelStore = useModelStore()
  const target = model ?? modelStore.activeModels.chat
  const isComfyUI =
    target?.provider === 'Custom' && String(target?.name ?? '').trim().toLowerCase() === 'comfyui'
  return isComfyUI ? (modelStore.customModels.chat.chatTemplate ?? DEFAULT_CHAT_TEMPLATE) : ''
}

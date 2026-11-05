import qwen3TextGen from './workflows/qwen3-text-gen.json'

// 对话场景的本地 ComfyUI 文本生成模板（「导出工作流 (API)」格式）。
// 与图像/视频侧一样，不放 index.ts，避免被 Nitro 扫描成额外路由。

export const DEFAULT_CHAT_TEMPLATE = 'qwen3-text-gen'

interface ChatWorkflowTemplate {
  label: string
  workflow: Record<string, any>
}

const WORKFLOW_TEMPLATES: Record<string, ChatWorkflowTemplate> = {
  [DEFAULT_CHAT_TEMPLATE]: {
    label: 'Qwen3 4B 本地文本生成',
    workflow: qwen3TextGen as Record<string, any>,
  },
}

// 每次返回深拷贝，避免注入提示词与种子时污染内置常量
export function resolveChatTemplate(id?: string): Record<string, any> {
  const key = id || DEFAULT_CHAT_TEMPLATE
  const entry = WORKFLOW_TEMPLATES[key]
  if (!entry) {
    throw createError({ statusCode: 400, statusMessage: `未知的本地 ComfyUI 文本模板：${key}` })
  }
  return structuredClone(entry.workflow)
}

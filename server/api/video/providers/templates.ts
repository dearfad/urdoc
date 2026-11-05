import fastH3I2v from './workflows/fastvideo-fasth3-i2v.json'

// 视频场景的本地 ComfyUI 内置预制模板（「导出工作流 (API)」格式）。
// 与图像侧一样，不放 index.ts，避免被 Nitro 扫描成额外路由。

export const DEFAULT_I2V_TEMPLATE = 'fastvideo-fasth3-i2v'

interface VideoWorkflowTemplate {
  label: string
  workflow: Record<string, any>
}

const WORKFLOW_TEMPLATES: Record<string, VideoWorkflowTemplate> = {
  [DEFAULT_I2V_TEMPLATE]: {
    label: 'FastVideo FastH3 图生视频',
    workflow: fastH3I2v as Record<string, any>,
  },
}

// 每次返回深拷贝，避免注入提示词、首帧图等参数时污染内置常量
export function resolveVideoTemplate(id?: string): Record<string, any> {
  const key = id || DEFAULT_I2V_TEMPLATE
  const entry = WORKFLOW_TEMPLATES[key]
  if (!entry) {
    throw createError({ statusCode: 400, statusMessage: `未知的本地 ComfyUI 视频模板：${key}` })
  }
  return structuredClone(entry.workflow)
}

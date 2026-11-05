import qwenT2i from './workflows/qwen-image-2.1-turbo-t2i.json'
import zImageTurbo from './workflows/z-image-turbo.json'
import qwenEdit from './workflows/qwen-image-2.1-turbo-edit.json'

// 本地 ComfyUI 内置预制模板（均为「导出工作流 (API)」格式，原样保留）。
// 不在 server/api 下使用 index.ts 命名，避免被扫描成额外路由。

export type WorkflowTask = 't2i' | 'edit'

interface WorkflowTemplate {
  label: string
  task: WorkflowTask
  workflow: Record<string, any>
}

export const DEFAULT_T2I_TEMPLATE = 'z-image-turbo'
export const DEFAULT_EDIT_TEMPLATE = 'qwen-image-2.1-turbo-edit'

const WORKFLOW_TEMPLATES: Record<string, WorkflowTemplate> = {
  'qwen-image-2.1-turbo': {
    label: 'Qwen Image 2.1 Turbo',
    task: 't2i',
    workflow: qwenT2i as Record<string, any>,
  },
  'z-image-turbo': {
    label: 'Z-Image Turbo',
    task: 't2i',
    workflow: zImageTurbo as Record<string, any>,
  },
  'qwen-image-2.1-turbo-edit': {
    label: 'Qwen Image 2.1 Turbo Edit',
    task: 'edit',
    workflow: qwenEdit as Record<string, any>,
  },
}

// 每次返回深拷贝，避免注入参数污染内置常量
export function resolveTemplate(id: string | undefined, task: WorkflowTask): Record<string, any> {
  const key = id || (task === 'edit' ? DEFAULT_EDIT_TEMPLATE : DEFAULT_T2I_TEMPLATE)
  const entry = WORKFLOW_TEMPLATES[key]
  if (!entry) {
    throw createError({ statusCode: 400, statusMessage: `未知的本地 ComfyUI 模板：${key}` })
  }
  if (entry.task !== task) {
    throw createError({
      statusCode: 400,
      statusMessage: `模板「${entry.label}」不适用于当前${task === 'edit' ? '图像编辑' : '文生图'}任务`,
    })
  }
  return structuredClone(entry.workflow)
}

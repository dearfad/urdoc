// ~/types/models.ts

// 单个模型选择（activeModels 条目）
export interface Model {
  provider: string | null
  name: string | null
  apiKey: string | null
  baseURL: string | null
}

// 提供商分组（每个 provider 有固定 apiKey/baseURL，包含多个模型名）
export interface ProviderGroup {
  provider: string
  apiKey: string
  baseURL: string
  models: string[]
}

export type Models = Record<string, ProviderGroup[]>

export type ActiveModels = Record<string, Model>

// 用户自定义的 Custom 提供商配置（按场景存储，持久化保存）
export interface CustomModelConfig {
  apiKey: string
  baseURL: string
  modelName: string
  // 本地 ComfyUI 文生图模板 ID（自定义生成 / 患者头像），可选字段兼容旧持久化数据
  t2iTemplate?: string
  // 本地 ComfyUI 图像编辑模板 ID（故事插图），可选字段兼容旧持久化数据
  editTemplate?: string
  // 本地 ComfyUI 图生视频模板 ID（影像渲染），可选字段兼容旧持久化数据
  i2vTemplate?: string
  // 本地 ComfyUI 文本生成模板 ID（对话及各类文本生成），可选字段兼容旧持久化数据
  chatTemplate?: string
}

export interface CustomModels {
  chat: CustomModelConfig
  image: CustomModelConfig
  audio: CustomModelConfig
  video: CustomModelConfig
}

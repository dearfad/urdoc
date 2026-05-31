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

export type Models = ProviderGroup[]

export type ActiveModels = Record<string, Model>

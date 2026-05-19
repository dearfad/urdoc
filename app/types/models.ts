// ~/types/models.ts

// 模型结构
export interface Model {
  provider: string | null
  name: string | null
  apiKey: string | null
  baseURL: string | null
}

export type Models = Model[]

export type ActiveModels = Record<string, Model>

// ~/types/models.ts

// 故事结构
export interface Model {
  provider: string | null
  name: string | null
  apiKey: string | null
  baseURL: string | null
}

export type Models = Model[]

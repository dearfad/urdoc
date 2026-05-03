// ~/types/stories.ts

// 故事结构
export interface Story {
  id: number | null
  tags: string[] | null
  custom: string[] | null
  reasoning: string | null
  content: string | null
}

export type Stories = Story[]

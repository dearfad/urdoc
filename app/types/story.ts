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

// 故事衍生内容（对话 / 讨论 / 点评）结构
export interface StorySubContent {
  content: string | null
  reasoning: string | null
}

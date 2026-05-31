// ~/types/tests.ts

// 考核理论内容结构
export interface Test {
  id: number | null
  tags: string[] | null
  custom: string[] | null
  reasoning: string | null
  content: string | null
}

export type Tests = Test[]

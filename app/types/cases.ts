// /app/types/cases.ts

// 病例结构
export interface Case {
  id: number
  tags: string[]
  source: Book | null
}

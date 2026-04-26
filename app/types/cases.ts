// /app/types/cases.ts

// 病例内容结构
export interface CaseContent {
  姓名?: string
  性别?: string
  年龄?: string
  主诉?: string
  现病史?: string
  既往史?: string
  查体?: string
  专科查体?: string
  辅助检查?: string
  诊断?: string
  治疗?: string
  手术?: string
  病理?: string
  [key: string]: any
}

// 病例结构
export interface Case {
  id: number
  tags: string[]
  textbook: Book | null
  custom: string[]
  content: CaseContent | null
}

export type Cases = Case[]

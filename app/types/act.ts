// ~/types/acts.ts

// 互动实践消息结构
export interface ActMessage {
  role: 'user' | 'assistant'
  content: string
}

// 互动实践结构
export interface Act {
  id: number | null
  caseId: number | null
  custom: string[] | null
  reasoning: string | null
  content: ActMessage[]
}

export type Acts = Act[]

// ~/types/acts.ts

// 互动实践消息结构
export interface ActMessage {
  role: 'user' | 'assistant'
  content: string
}

// 结束问诊考题
export interface ActQuizItem {
  question: string
  options: Record<string, string>
  answer: string
}

// 互动实践结构
export interface Act {
  id: number | null
  caseId: number | null
  custom: string[] | null
  reasoning: string | null
  content: ActMessage[]
  quiz: ActQuizItem[] | null
  userAnswers: Record<string, string> | null
  quizSubmitted: boolean
  quizScore: number | null
}

export type Acts = Act[]

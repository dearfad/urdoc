export interface TaskState {
  status: 'pending' | 'succeeded' | 'failed'
  images?: { url: string }[]
  prompt: string
  model: any
  config: any
  createdAt: number
  error?: string
}

export const imageTaskStore = new Map<string, TaskState>()

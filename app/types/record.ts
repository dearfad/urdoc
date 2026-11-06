// 全局生成顺序的步骤标识，与八个内容页面一一对应
export type RecordStepKey = 'case' | 'story' | 'test' | 'act' | 'rate' | 'image' | 'video' | 'audio'

// 步骤元数据：流程示意图、上下文注入与叙事计划共用
export interface RecordStepMeta {
  key: RecordStepKey
  label: string
  icon: string
  to: string
  description: string
}

// 流程示意图节点：状态全部由 record store 派生，不持久化
export interface RecordFlowNode extends RecordStepMeta {
  index: number
  hasContent: boolean
  isGenerating: boolean
  needsRegenerate: boolean
}

// 叙事医学中可生成的子任务，与 app/types/narrative.ts 的开关一一对应
export type NarrativeTaskKey =
  | 'case'
  | 'story'
  | 'conversation'
  | 'discussion'
  | 'comment'
  | 'avatar'
  | 'illustration'

// 按 record 顺序展开后的叙事医学计划项：同一主项的子任务就近串行执行
export interface NarrativePlanStep {
  step: RecordStepKey
  tasks: NarrativeTaskKey[]
}

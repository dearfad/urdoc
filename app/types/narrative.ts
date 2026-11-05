// 叙事医学单页包含的内容区块
export type NarrativeSectionKey =
  | 'case'
  | 'story'
  | 'conversation'
  | 'discussion'
  | 'comment'
  | 'avatar'
  | 'illustration'

// 各区块的生成 / 显示开关
export type NarrativeFlags = Record<NarrativeSectionKey, boolean>

// 设定卡片中的两类开关
export type NarrativeSettingKind = 'generate' | 'show'

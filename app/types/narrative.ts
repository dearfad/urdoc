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

// 布局区域：把区块按区域分组，具体位置由模板 CSS 决定
export interface NarrativeLayoutArea {
  key: string // 与 data-nm-area 对应，供模板 CSS 定位
  blocks: NarrativeSectionKey[] // 同一区域内的区块（可一个或多个）
}

// 声明式布局：不声明时沿用默认的线性单列结构。
// 只改变区块的排列与分组，不改变区块集合与数据来源。
export interface NarrativeLayout {
  areas: NarrativeLayoutArea[]
}

// 显示模板元数据：可只提供视觉令牌，也可额外声明布局分组
export interface NarrativeTemplateMeta {
  id: string // 与 #nm-sheet 上的 data-nm-template 值一致
  label: string // 选择器显示名
  description: string // 风格简述
  icon: string // i-lucide-* 图标名
  swatch: [string, string] // 选择器预览色卡起止色
  layout?: NarrativeLayout
}

// 叙事单页的纯视图数据：与视觉完全解耦，模板切换不会触发这些数据重算
export interface NarrativeSheetData {
  diseaseName: string
  show: NarrativeFlags
  hasCase: boolean
  caseHeaders: [string, string][]
  caseOthers: [string, string][]
  patientName: string
  avatarSrc: string
  isAvatarGenerating: boolean
  storyContent: string
  conversationContent: string
  discussionContent: string
  commentContent: string
  generatingSection: string | null
  illustrationImages: { url: string; prompt: string }[]
  isIllustrationGenerating: boolean
  pendingIllustrations: number
}

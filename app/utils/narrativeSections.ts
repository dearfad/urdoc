import type { NarrativeSectionKey } from '~/types/narrative'

// 疾病设定在 stateStore.case.custom / stateStore.story.custom 中使用的前缀标记
export const NARRATIVE_DISEASE_TAG = '疾病：'

// 病例卡片头部字段：置于头像左侧，各自成行
export const NARRATIVE_CASE_HEADER_KEYS = ['姓名', '性别', '年龄', '主诉']

// 单页区块展示元数据：模板切换不改变这份清单
export interface NarrativeBlockMeta {
  key: NarrativeSectionKey
  label: string
  hint: string
  icon: string
  badge: string
  delay: string
}

export const NARRATIVE_BLOCKS: NarrativeBlockMeta[] = [
  {
    key: 'case',
    label: '病例',
    hint: '病史、主诉与临床信息',
    icon: 'i-lucide-clipboard-list',
    badge: 'CASE',
    delay: '0ms',
  },
  {
    key: 'story',
    label: '故事',
    hint: '患者叙事与生活脉络',
    icon: 'i-lucide-book-open',
    badge: 'STORY',
    delay: '80ms',
  },
  {
    key: 'conversation',
    label: '对话',
    hint: '医患交流与共情场景',
    icon: 'i-lucide-messages-square',
    badge: 'DIALOGUE',
    delay: '140ms',
  },
  {
    key: 'discussion',
    label: '讨论',
    hint: '多角度思辨与叙事分析',
    icon: 'i-lucide-lightbulb',
    badge: 'DISCUSSION',
    delay: '200ms',
  },
  {
    key: 'comment',
    label: '点评',
    hint: '收获、启发与反思',
    icon: 'i-lucide-award',
    badge: 'COMMENT',
    delay: '260ms',
  },
]

// 设定卡片中的开关项：图标与配色沿用叙事单页各区块的视觉语言
export interface NarrativeSettingSection {
  key: NarrativeSectionKey
  label: string
  hint: string
  icon: string
  tone: string
  // 生成顺序由 record 决定，不再按上游自动跳过；仅显示项仍依附所属卡片
  generateDependsOn?: NarrativeSectionKey
  showDependsOn?: NarrativeSectionKey
}

export const NARRATIVE_SETTING_SECTIONS: NarrativeSettingSection[] = [
  {
    key: 'case',
    label: '病例',
    hint: '病史与临床信息',
    icon: 'i-lucide-clipboard-list',
    tone: 'text-rose-500',
  },
  {
    key: 'story',
    label: '故事',
    hint: '患者叙事脉络',
    icon: 'i-lucide-book-open',
    tone: 'text-amber-500',
    generateDependsOn: 'case',
  },
  {
    key: 'conversation',
    label: '对话',
    hint: '医患交流场景',
    icon: 'i-lucide-messages-square',
    tone: 'text-cyan-500',
    generateDependsOn: 'story',
  },
  {
    key: 'discussion',
    label: '讨论',
    hint: '多角度思辨',
    icon: 'i-lucide-lightbulb',
    tone: 'text-emerald-500',
    generateDependsOn: 'conversation',
  },
  {
    key: 'comment',
    label: '点评',
    hint: '收获与反思',
    icon: 'i-lucide-award',
    tone: 'text-violet-500',
    generateDependsOn: 'discussion',
  },
  {
    key: 'avatar',
    label: '患者头像',
    hint: '显示于病例卡片',
    icon: 'i-lucide-user',
    tone: 'text-pink-500',
    generateDependsOn: 'case',
    showDependsOn: 'case',
  },
  {
    key: 'illustration',
    label: '故事插图',
    hint: '故事四格插图',
    icon: 'i-lucide-layout-grid',
    tone: 'text-orange-500',
    generateDependsOn: 'story',
    showDependsOn: 'story',
  },
]

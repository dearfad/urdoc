import type { NarrativeTemplateMeta } from '~/types/narrative'

// 显示模板注册表：每套模板 = 此处一项元数据 + app/assets/css/narrative/templates/ 下的一份令牌 CSS
// 模板可只提供视觉令牌，也可通过 layout 声明区块分组；区块集合与数据来源始终不变
export const NARRATIVE_TEMPLATES: NarrativeTemplateMeta[] = [
  {
    id: 'magazine',
    label: '叙事杂志',
    description: '暖粉渐变、衬线刊名与彩色卡片',
    icon: 'i-lucide-book-open',
    swatch: ['#f43f5e', '#f59e0b'],
  },
  {
    id: 'clinical',
    label: '病历档案',
    description: '石板蓝灰、编号刊头与紧凑版式',
    icon: 'i-lucide-folder-open',
    swatch: ['#334155', '#0f766e'],
  },
  {
    id: 'editorial',
    label: '编辑网格',
    description: '左右分栏、编号水印与粗线硬阴影',
    icon: 'i-lucide-layout-grid',
    swatch: ['#4338ca', '#ea580c'],
    // 声明式布局：病例跨左侧两行，故事与对话堆叠在右侧，讨论与点评落在底部
    layout: {
      areas: [
        { key: 'case', blocks: ['case'] },
        { key: 'story', blocks: ['story'] },
        { key: 'conversation', blocks: ['conversation'] },
        { key: 'discussion', blocks: ['discussion'] },
        { key: 'comment', blocks: ['comment'] },
      ],
    },
  },
]

// 默认模板固定为注册表第一项
export const DEFAULT_NARRATIVE_TEMPLATE_ID: string = NARRATIVE_TEMPLATES[0]!.id

// 兜底解析：本地存储脏值、已下线模板 id 一律回退默认模板，避免页面无样式
export function resolveNarrativeTemplate(id: string | undefined): NarrativeTemplateMeta {
  return NARRATIVE_TEMPLATES.find((item) => item.id === id) ?? NARRATIVE_TEMPLATES[0]!
}

export interface DocNavItem {
  label: string
  icon: string
  slug: string
  description?: string
}

export interface DocGroup {
  label: string
  icon: string
  children: DocNavItem[]
}

/**
 * 文档导航树，与 public/docs/ 目录结构对应
 */
export const docNav: (DocNavItem | DocGroup)[] = [
  { label: '文档概览', icon: 'i-lucide-book-open', slug: 'index', description: 'URDOC 平台文档总览' },
  { label: '快速开始', icon: 'i-lucide-rocket', slug: 'getting-started', description: '快速上手平台功能' },
  {
    label: 'CSTAR 框架',
    icon: 'i-lucide-circle-star',
    children: [
      { label: '框架说明', icon: 'i-lucide-circle-star', slug: 'cstar/index' },
      { label: '生成病例', icon: 'i-mdi-alpha-c-circle', slug: 'cstar/case' },
      { label: '编写故事', icon: 'i-mdi-alpha-s-circle', slug: 'cstar/story' },
      { label: '考核理论', icon: 'i-mdi-alpha-t-circle', slug: 'cstar/test' },
      { label: '互动实践', icon: 'i-mdi-alpha-a-circle', slug: 'cstar/act' },
      { label: '评估能力', icon: 'i-mdi-alpha-r-circle', slug: 'cstar/rate' },
    ],
  } as DocGroup,
  {
    label: '多模态工具',
    icon: 'i-lucide-file-stack',
    children: [
      { label: '工具说明', icon: 'i-lucide-file-stack', slug: 'multimodal/index' },
      { label: '图像创作', icon: 'i-lucide-image', slug: 'multimodal/image' },
      { label: '视频渲染', icon: 'i-lucide-video', slug: 'multimodal/video' },
      { label: '语音合成', icon: 'i-lucide-speech', slug: 'multimodal/speech' },
    ],
  } as DocGroup,
  { label: '项目背景', icon: 'i-lucide-info', slug: 'project', description: 'URDOC 平台的设计理念与愿景' },
  { label: '开发者指南', icon: 'i-lucide-code', slug: 'development', description: '架构、技术栈与部署说明' },
]

export function getDocTitle(slug: string): string {
  for (const item of docNav) {
    if ('slug' in item && item.slug === slug) return item.label
    if ('children' in item) {
      const child = item.children.find((c) => c.slug === slug)
      if (child) return child.label
    }
  }
  return slug
}

export function flattenDocNav(): DocNavItem[] {
  const result: DocNavItem[] = []
  for (const item of docNav) {
    if ('slug' in item) {
      result.push(item)
    } else if ('children' in item) {
      result.push(...item.children)
    }
  }
  return result
}

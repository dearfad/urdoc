import type { BreadcrumbItem } from '@nuxt/ui'
import type { Sibling } from '~/types/breadcrumb'

const rootItem: BreadcrumbItem = { label: '概览', icon: 'i-lucide-house', to: '/dashboard' }

const cstarGroup: { parent: BreadcrumbItem; siblings: Sibling[] } = {
  parent: { label: 'CSTAR', icon: 'i-lucide-circle-star' },
  siblings: [
    { label: '生成病例', abbr: '病', icon: 'i-mdi-alpha-c-circle', to: '/cstar/case' },
    { label: '编写故事', abbr: '故', icon: 'i-mdi-alpha-s-circle', to: '/cstar/story' },
    { label: '考核理论', abbr: '考', icon: 'i-mdi-alpha-t-circle', to: '/cstar/test' },
    { label: '互动实践', abbr: '互', icon: 'i-mdi-alpha-a-circle', to: '/cstar/act' },
    { label: '评估能力', abbr: '评', icon: 'i-mdi-alpha-r-circle', to: '/cstar/rate' },
  ],
}

const multimodalGroup: { parent: BreadcrumbItem; siblings: Sibling[] } = {
  parent: { label: '多模态', icon: 'i-lucide-file-stack' },
  siblings: [
    { label: '图像创作', abbr: '图', icon: 'i-lucide-image', to: '/multimodal/image' },
    { label: '影像渲染', abbr: '影', icon: 'i-lucide-video', to: '/multimodal/video' },
    { label: '音频合成', abbr: '音', icon: 'i-lucide-mic', to: '/multimodal/audio' },
  ],
}

export function useBreadcrumb() {
  const route = useRoute()

  const items = computed<BreadcrumbItem[]>(() => {
    const path = route.path

    if (path.startsWith('/cstar/')) {
      const current = cstarGroup.siblings.find(s => path === s.to)
      if (!current) return [rootItem, cstarGroup.parent]
      return [rootItem, cstarGroup.parent, current]
    }

    if (path.startsWith('/multimodal/')) {
      const current = multimodalGroup.siblings.find(s => path === s.to)
      if (!current) return [rootItem, multimodalGroup.parent]
      return [rootItem, multimodalGroup.parent, current]
    }

    if (path === '/settings') {
      return [rootItem, { label: '设置', icon: 'i-lucide-settings', to: '/settings' }]
    }

    if (path === '/docs') {
      return [rootItem, { label: '文档', icon: 'i-lucide-book-open-text', to: '/docs' }]
    }

    if (path.startsWith('/docs/')) {
      return [rootItem, { label: '文档', icon: 'i-lucide-book-open-text', to: '/docs' }]
    }

    if (path === '/dashboard') {
      return [rootItem]
    }

    if (path.startsWith('/project/')) {
      return [rootItem, { label: '叙事医学', icon: 'i-lucide-book', to: '/project/narrative-medicine' }]
    }

    return [rootItem]
  })

  const siblings = computed<Sibling[]>(() => {
    const path = route.path

    if (path.startsWith('/cstar/')) return cstarGroup.siblings
    if (path.startsWith('/multimodal/')) return multimodalGroup.siblings

    return []
  })

  return { items, siblings }
}

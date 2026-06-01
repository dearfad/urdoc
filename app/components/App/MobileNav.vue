<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-elevated border-t border-default shadow-[0_-2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_-2px_8px_rgba(0,0,0,0.2)] pb-[env(safe-area-inset-bottom)]">
    <!-- 子页面快捷切换条（当前活跃区块有子页面时显示） -->
    <div class="flex justify-center pt-0.5 pb-0 h-6">
      <template v-for="tab in tabs" :key="tab.label">
        <div
          v-if="tab.children?.length && isActive(tab)"
          class="flex items-center gap-1"
        >
          <NuxtLink
            v-for="child in tab.children"
            :key="child.to"
            :to="child.to"
            class="size-5 flex items-center justify-center rounded-full text-[10px] font-bold leading-none transition-colors"
            :class="route.path === child.to
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted hover:text-default hover:bg-muted'"
            :title="child.label"
          >
            {{ child.abbr }}
          </NuxtLink>
        </div>
      </template>
    </div>
    <!-- 主标签栏 -->
    <div class="flex items-center justify-around pb-1.5">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.label"
        :to="tab.to"
        class="flex flex-col items-center gap-0 px-3 py-1 rounded-lg transition-colors min-w-0"
        :class="isActive(tab) ? 'text-primary' : 'text-muted hover:text-default'"
      >
        <UIcon :name="tab.icon" class="size-5" />
        <span class="text-[10px] leading-tight font-medium mt-0.5">{{ tab.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

interface TabChild {
  label: string
  abbr: string
  to: string
}

interface Tab {
  label: string
  icon: string
  to: string
  match: string
  children?: TabChild[]
}

const tabs: Tab[] = [
  {
    label: '概览',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard',
    match: '/dashboard',
  },
  {
    label: 'CSTAR',
    icon: 'i-lucide-circle-star',
    to: '/cstar/case',
    match: '/cstar',
    children: [
      { label: '生成病例', abbr: '病', to: '/cstar/case' },
      { label: '编写故事', abbr: '故', to: '/cstar/story' },
      { label: '考核理论', abbr: '考', to: '/cstar/test' },
      { label: '互动实践', abbr: '互', to: '/cstar/act' },
      { label: '评估能力', abbr: '评', to: '/cstar/rate' },
    ],
  },
  {
    label: '多模态',
    icon: 'i-lucide-file-stack',
    to: '/multimodal/image',
    match: '/multimodal',
    children: [
      { label: '图像创作', abbr: '图', to: '/multimodal/image' },
      { label: '影像渲染', abbr: '影', to: '/multimodal/video' },
      { label: '音频合成', abbr: '音', to: '/multimodal/audio' },
    ],
  },
  {
    label: '文档',
    icon: 'i-lucide-book-open-text',
    to: '/docs',
    match: '/docs',
  },
  {
    label: '设置',
    icon: 'i-lucide-settings',
    to: '/settings',
    match: '/settings',
  },
]

function isActive(tab: Tab): boolean {
  return route.path === tab.to || route.path.startsWith(tab.match + '/') || route.path === tab.match
}
</script>

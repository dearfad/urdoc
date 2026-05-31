<template>
  <UDashboardSidebar id="default" collapsible resizable>
    <template #header="{ collapsed }">
      <AppLogo class="h-8 w-auto shrink-0" />
      <NuxtLink to="/">
        <span v-if="!collapsed" class="text-xl font-bold">URDOC</span>
      </NuxtLink>
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu :collapsed="collapsed" :items="items" orientation="vertical" tooltip popover />
    </template>

    <template #footer="{ collapsed }">
      <UButton
        :label="collapsed ? '' : '设置'"
        icon="i-lucide-settings"
        to="/settings"
        color="neutral"
        variant="ghost"
        class="font-bold text-base w-full"
      />
    </template>
  </UDashboardSidebar>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const items = [
  {
    label: '概览',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard',
  },
  {
    label: '项目',
    icon: 'i-lucide-book',
    defaultOpen: true,
    children: [
      {
        label: '叙事医学',
        icon: 'i-lucide-book-plus',
        to: '/project/narrative-medicine',
        class: 'font-bold text-base',
      },
    ],
  },
  {
    label: 'CSTAR',
    icon: 'i-lucide-circle-star',
    defaultOpen: true,
    children: [
      {
        label: '生成病例',
        icon: 'i-mdi-alpha-c-circle',
        to: '/cstar/case',
        class: 'font-bold text-base',
      },
      {
        label: '编写故事',
        icon: 'i-mdi-alpha-s-circle',
        to: '/cstar/story',
        class: 'font-bold text-base',
      },
      {
        label: '考核理论',
        icon: 'i-mdi-alpha-t-circle',
        to: '/cstar/test',
        class: 'font-bold text-base',
      },
      {
        label: '互动实践',
        icon: 'i-mdi-alpha-a-circle',
        to: '/cstar/act',
        class: 'font-bold text-base',
      },
      {
        label: '评估能力',
        icon: 'i-mdi-alpha-r-circle',
        to: '/cstar/rate',
        class: 'font-bold text-base',
      },
    ],
  },
  {
    label: '多模态',
    icon: 'i-lucide-file-stack',
    defaultOpen: true,
    children: [
      {
        label: '图像创作',
        icon: 'i-lucide-image',
        to: '/multimodal/image',
        class: 'font-bold text-base',
      },
      {
        label: '视频渲染',
        icon: 'i-lucide-video',
        to: '/multimodal/video',
        class: 'font-bold text-base',
      },
      {
        label: '语音合成',
        icon: 'i-lucide-speech',
        to: '/multimodal/speech',
        class: 'font-bold text-base',
      },
    ],
  },
  {
    label: '文档',
    icon: 'i-lucide-book-open-text',
    defaultOpen: false,
    children: [
      {
        label: '文档概览',
        icon: 'i-lucide-book-open',
        to: '/docs',
      },
      {
        label: '快速开始',
        icon: 'i-lucide-rocket',
        to: '/docs/getting-started',
      },
      {
        label: 'CSTAR 框架',
        icon: 'i-lucide-circle-star',
        to: '/docs/cstar/index',
      },
      {
        label: '  生成病例',
        icon: 'i-mdi-alpha-c-circle',
        to: '/docs/cstar/case',
        class: 'pl-8 text-sm',
      },
      {
        label: '  编写故事',
        icon: 'i-mdi-alpha-s-circle',
        to: '/docs/cstar/story',
        class: 'pl-8 text-sm',
      },
      {
        label: '  考核理论',
        icon: 'i-mdi-alpha-t-circle',
        to: '/docs/cstar/test',
        class: 'pl-8 text-sm',
      },
      {
        label: '  互动实践',
        icon: 'i-mdi-alpha-a-circle',
        to: '/docs/cstar/act',
        class: 'pl-8 text-sm',
      },
      {
        label: '  评估能力',
        icon: 'i-mdi-alpha-r-circle',
        to: '/docs/cstar/rate',
        class: 'pl-8 text-sm',
      },
      {
        label: '多模态工具',
        icon: 'i-lucide-file-stack',
        to: '/docs/multimodal/index',
      },
      {
        label: '  图像创作',
        icon: 'i-lucide-image',
        to: '/docs/multimodal/image',
        class: 'pl-8 text-sm',
      },
      {
        label: '  视频渲染',
        icon: 'i-lucide-video',
        to: '/docs/multimodal/video',
        class: 'pl-8 text-sm',
      },
      {
        label: '  语音合成',
        icon: 'i-lucide-speech',
        to: '/docs/multimodal/speech',
        class: 'pl-8 text-sm',
      },
      {
        label: '项目背景',
        icon: 'i-lucide-info',
        to: '/docs/project',
      },
      {
        label: '开发者指南',
        icon: 'i-lucide-code',
        to: '/docs/development',
      },
      {
        label: '  自定义教科书',
        icon: 'i-lucide-book-type',
        to: '/docs/development/custom-textbook',
        class: 'pl-8 text-sm',
      },
    ],
  },
] satisfies NavigationMenuItem[]
</script>

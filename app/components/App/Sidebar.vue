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
        to: '/case',
        class: 'font-bold text-base',
      },
      {
        label: '编写故事',
        icon: 'i-mdi-alpha-s-circle',
        class: 'font-bold text-base',
      },
      {
        label: '考核理论',
        icon: 'i-mdi-alpha-t-circle',
        class: 'font-bold text-base',
      },
      {
        label: '互动实践',
        icon: 'i-mdi-alpha-a-circle',
        class: 'font-bold text-base',
      },
      {
        label: '评估能力',
        icon: 'i-mdi-alpha-r-circle',
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
        class: 'font-bold text-base',
      },
      {
        label: '视频渲染',
        icon: 'i-lucide-video',
        class: 'font-bold text-base',
      },
      {
        label: '语音合成',
        icon: 'i-lucide-speech',
        class: 'font-bold text-base',
      },
    ],
  },
] satisfies NavigationMenuItem[]
</script>

<template>
  <!-- <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto my-4 px-2 ga-4">
    <PoseContentShow />
    <PoseContentPrompt />
    <PoseUtilsGenerate />
  </v-sheet> -->
  <UDashboardPanel id="pages-multimodal-video">
    <template #header>
      <UDashboardNavbar title="视频渲染">
        <template #leading>
          <UTooltip text="侧边栏">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
        <template #right>
          <AppHeader />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>
    <template #body>
      <CardCase />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  title: '视频渲染',
})
import type { BreadcrumbItem } from '@nuxt/ui'
const items = ref<BreadcrumbItem[]>([
  {
    label: '首页',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: '视频渲染',
    icon: 'i-lucide-video',
    to: '/multimodal/video',
  },
])
</script>

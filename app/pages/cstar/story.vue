<template>
  <UDashboardPanel id="pages-cstar-story">
    <template #header>
      <UDashboardNavbar title="编写故事">
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
      <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto md:flex-row">
        <Story class="flex min-h-0 w-full flex-col flex-1 md:flex-2" />
        <StorySettings class="flex min-h-0 w-full flex-col md:flex-1" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  title: '编写故事',
})
import type { BreadcrumbItem } from '@nuxt/ui'
const items = ref<BreadcrumbItem[]>([
  {
    label: '概览',
    icon: 'i-lucide-house',
    to: '/dashboard',
  },
  {
    label: '编写故事',
    icon: 'i-mdi-alpha-s-circle',
    to: '/cstar/story',
  },
])
</script>

<template>
  <UDashboardPanel id="pages-cstar-rate">
    <template #header>
      <UDashboardNavbar title="评估能力">
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
      <div class="flex min-h-0 flex-1 flex-col gap-2 md:flex-row">
        <Rate class="flex min-h-0 w-full flex-col md:flex-2" />
        <RateSettings class="flex min-h-0 w-full flex-col md:flex-1" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  title: '评估能力',
})
import type { BreadcrumbItem } from '@nuxt/ui'
const items = ref<BreadcrumbItem[]>([
  {
    label: '概览',
    icon: 'i-lucide-house',
    to: '/dashboard',
  },
  {
    label: '评估能力',
    icon: 'i-mdi-alpha-r-circle',
    to: '/cstar/rate',
  },
])
</script>

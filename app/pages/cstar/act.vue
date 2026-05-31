<template>
  <UDashboardPanel id="pages-cstar-act">
    <template #header>
      <UDashboardNavbar title="互动实践">
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
        <Act class="flex min-h-0 w-full flex-col md:flex-2" />
        <ActSettings class="flex min-h-0 w-full flex-col md:flex-1" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  title: '互动实践',
})
import type { BreadcrumbItem } from '@nuxt/ui'
const items = ref<BreadcrumbItem[]>([
  {
    label: '概览',
    icon: 'i-lucide-house',
    to: '/dashboard',
  },
  {
    label: '互动实践',
    icon: 'i-mdi-alpha-a-circle',
    to: '/cstar/act',
  },
])
</script>

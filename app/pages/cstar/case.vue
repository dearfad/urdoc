<template>
  <UDashboardPanel id="pages-cstar-case">
    <template #header>
      <UDashboardNavbar title="生成病例">
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
        <Case class="flex min-h-0 w-full flex-col md:flex-2" />
        <CaseSettings class="flex min-h-0 w-full flex-col md:flex-1" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  title: '生成病例',
})
import type { BreadcrumbItem } from '@nuxt/ui'
const items = ref<BreadcrumbItem[]>([
  {
    label: '概览',
    icon: 'i-lucide-house',
    to: '/dashboard',
  },
  {
    label: '生成病例',
    icon: 'i-mdi-alpha-c-circle',
    to: '/cstar/case',
  },
])
</script>

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
      <!-- <CardCase /> -->
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
    label: '首页',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: '评估能力',
    icon: 'i-mdi-alpha-r-circle',
    to: '/cstar/rate',
  },
])
</script>

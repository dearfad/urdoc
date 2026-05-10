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
      <div class="flex flex-col gap-2 md:flex-row">
        <Act class="w-full md:flex-2" />
        <ActSettings class="w-full md:flex-1" />
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
    label: '首页',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: '互动实践',
    icon: 'i-mdi-alpha-a-circle',
    to: '/cstar/act',
  },
])
</script>

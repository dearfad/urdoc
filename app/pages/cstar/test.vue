<template>
  <UDashboardPanel id="pages-cstar-test">
    <template #header>
      <UDashboardNavbar title="考核理论">
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
        <Test class="w-full md:flex-2" />
        <TestSettings class="w-full md:flex-1" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  title: '考核理论',
})
import type { BreadcrumbItem } from '@nuxt/ui'
const items = ref<BreadcrumbItem[]>([
  {
    label: '首页',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: '考核理论',
    icon: 'i-mdi-alpha-t-circle',
    to: '/cstar/test',
  },
])
</script>

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
        <AppNavigationMenu />
      </UDashboardToolbar>
    </template>
    <template #body>
      <!-- <CardCase /> -->
    </template>
  </UDashboardPanel>
</template>

<script setup>
definePageMeta({
  title: '评估能力',
})
</script>

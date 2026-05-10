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
        <AppNavigationMenu />
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

<script setup>
definePageMeta({
  title: '互动实践',
})
</script>

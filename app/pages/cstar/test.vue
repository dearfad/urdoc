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
    </template>
    <template #body>
      <div class="flex flex-col gap-2 md:flex-row">
        <Test class="w-full md:flex-2" />
        <TestSettings class="w-full md:flex-1" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
definePageMeta({
  title: '考核理论',
})
</script>

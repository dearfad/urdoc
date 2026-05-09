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
    </template>
    <template #body>
      <div class="flex flex-col gap-2 md:flex-row">
        <Case class="w-full md:flex-2" />
        <CaseSettings class="w-full md:flex-1" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
definePageMeta({
  title: '生成病例',
})
</script>

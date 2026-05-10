<template>
  <UDashboardPanel id="pages-cstar-story">
    <template #header>
      <UDashboardNavbar title="编写故事">
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
        <Story class="w-full md:flex-2" />
        <StorySettings class="w-full md:flex-1" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
definePageMeta({
  title: '编写故事',
})
</script>

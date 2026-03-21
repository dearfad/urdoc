<template>
  <UDashboardPanel id="pages-settings">
    <template #header>
      <UDashboardNavbar title="设置">
        <template #leading>
          <UTooltip text="侧边栏">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar />
    </template>
    <template #body>
      <CardCase />
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
definePageMeta({
  title: '设置',
})
</script>

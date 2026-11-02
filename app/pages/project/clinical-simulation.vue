<template>
  <UDashboardPanel
    id="pages-project-narrative-medicine"
    class="bg-linear-to-br from-amber-50/40 via-rose-50/40 to-cyan-50/40"
  >
    <template #header>
      <UDashboardNavbar title="临床实战">
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
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  title: '临床实战',
})
</script>

<style></style>

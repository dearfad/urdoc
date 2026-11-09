<template>
  <UDashboardPanel
    id="pages-project-narrative-medicine"
    class="bg-linear-to-br from-amber-50/40 via-rose-50/40 to-cyan-50/40"
  >
    <template #header>
      <UDashboardNavbar :title="t('sidebar.pedagogicalResearch')">
        <template #leading>
          <UTooltip :text="t('common.sidebar')">
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
  title: '教法研究',
})

const { t } = useI18n()
</script>

<style></style>

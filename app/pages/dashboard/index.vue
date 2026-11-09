<template>
  <UDashboardPanel id="pages-dashboard-index">
    <template #header>
      <UDashboardNavbar :title="t('sidebar.overview')">
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
    <template #body>
      <div class="divide-border-muted divide-y">
        <div class="animate-rise" style="animation-delay: 0.02s"><DashboardBranchActivity /></div>
        <div class="animate-rise" style="animation-delay: 0.08s"><DashboardWorkspaceStats /></div>
        <div class="animate-rise" style="animation-delay: 0.14s"><DashboardQuickEntries /></div>
        <div class="animate-rise" style="animation-delay: 0.2s"><DashboardProjectInfo /></div>
        <div class="animate-rise" style="animation-delay: 0.26s"><DashboardServiceStatus /></div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped>
@keyframes dashboard-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-rise {
  animation: dashboard-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .animate-rise {
    animation: none;
  }
}
</style>

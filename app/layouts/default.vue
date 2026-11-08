<template>
  <UApp :locale="uiLocale">
    <UDashboardGroup>
      <AppSidebar />
      <div class="min-w-0 flex-1 flex">
        <slot />
      </div>
    </UDashboardGroup>
  </UApp>
</template>

<script setup lang="ts">
const { uiLocale } = useUiLocale()
</script>

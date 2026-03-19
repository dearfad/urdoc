<template>
  <UApp :locale="zh_cn">
    <UDashboardGroup unit="rem">
      <AppSidebar />
      <slot />
    </UDashboardGroup>
  </UApp>
</template>

<script setup lang="ts">
import { zh_cn } from '@nuxt/ui/locale'
</script>

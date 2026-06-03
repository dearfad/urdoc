<template>
  <UApp :locale="zh_cn">
    <UDashboardGroup>
      <AppSidebar />
      <div class="min-w-0 flex-1 flex">
        <slot />
      </div>
    </UDashboardGroup>
  </UApp>
</template>

<script setup lang="ts">
import { zh_cn } from '@nuxt/ui/locale'
</script>

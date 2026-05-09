<template>
  <UApp :locale="zh_cn">
    <UMain>
      <slot />
    </UMain>
  </UApp>
</template>

<script setup lang="ts">
import { zh_cn } from '@nuxt/ui/locale'
</script>

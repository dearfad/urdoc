<template>
  <UApp :locale="uiLocale">
    <UError :error="error" />
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()

const { uiLocale } = useUiLocale()
</script>

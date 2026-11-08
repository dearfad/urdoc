<template>
  <UApp :locale="uiLocale">
    <UMain>
      <slot />
    </UMain>
  </UApp>
</template>

<script setup lang="ts">
const { uiLocale } = useUiLocale()
</script>

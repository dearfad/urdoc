<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { lang } = useUiLocale()

useHead(() => ({
  htmlAttrs: { lang: lang.value },
}))
</script>

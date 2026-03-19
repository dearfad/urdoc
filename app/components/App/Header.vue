<template>
  <UHeader title="URDOC">
    <template #title> <UIcon name="i-lucide-hospital" class="size-8 text-blue-500" /> URDOC </template>
    <template #right>
      <UNavigationMenu :items="items" variant="link" />
      <UColorModeButton />
      <UButton
        to="https://github.com/dearfad/urdoc"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const items = computed(() => [
  {
    label: '文档',
    to: 'https://docs.urdoc.dearfad.com',
  },
])
</script>

<template>
  <UHeader title="URDOC">
    <UNavigationMenu :items="items" variant="link" />
    <template #right>
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
  </UHeader>
</template>

<script setup lang="ts">
const route = useRoute()
const items = computed(() => [
  {
    label: '文档',
    to: 'https://docs.urdoc.dearfad.com',
    icon: 'i-lucide-book-text',
  },
])
</script>

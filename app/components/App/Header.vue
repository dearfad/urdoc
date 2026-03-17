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
    label: 'Docs',
    to: '/docs',
    active: route.path.startsWith('/docs'),
  },
  {
    label: 'Pricing',
    to: '/pricing',
  },
  {
    label: 'Blog',
    to: '/blog',
  },
  {
    label: 'Changelog',
    to: '/changelog',
  },
])
</script>

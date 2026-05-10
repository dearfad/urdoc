<template>
  <UNavigationMenu :items="items" highlight class="flex-1" />
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [
  [
    {
      label: '项目',
      icon: 'i-lucide-user',
      active: true,
    },
    {
      label: 'CSTAR',
      icon: 'i-lucide-users',
    },
    {
      label: '多模态',
      icon: 'i-lucide-bell',
    },
  ],
  [
    {
      label: '设置',
      icon: 'i-lucide-bell',
    },
  ],
]
</script>

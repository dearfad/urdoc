<template>
  <UDashboardSidebar
    id="default"
    v-model:open="open"
    collapsible
    resizable
    class="bg-elevated/25"
    :ui="{ footer: 'lg:border-t lg:border-default' }"
  >
    <template #default="{ collapsed }">
      <UNavigationMenu :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip popover />
      <UNavigationMenu :collapsed="collapsed" :items="links[1]" orientation="vertical" tooltip class="mt-auto" />
    </template>
  </UDashboardSidebar>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const open = ref(false)
const links = [
  [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/dashboard',
    },
    {
      label: 'Customers',
      icon: 'i-lucide-users',
      to: '/customers',
    },
  ],
  [
    {
      label: '设置',
      to: '/settings',
      icon: 'i-lucide-settings',
      defaultOpen: true,
      type: 'trigger',
    },
  ],
] satisfies NavigationMenuItem[][]
</script>

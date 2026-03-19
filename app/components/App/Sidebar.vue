<template>
  <UDashboardSidebar
    id="default"
    v-model:open="open"
    collapsible
    resizable
    class="bg-elevated/25"
    :ui="{ footer: 'lg:border-t lg:border-default' }"
  >
    <template #header="{ collapsed }">
      <NuxtLink to="/" class="flex items-end gap-0.5">
        <span v-if="!collapsed" class="text-xl font-bold text-highlighted">URDOC</span>
      </NuxtLink>

      <div v-if="!collapsed" class="flex items-center gap-1.5 ms-auto">
        <UDashboardSearch />
        <UDashboardSearchButton collapsed />
      </div>
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu :collapsed="collapsed" :items="links" orientation="vertical" tooltip popover />
    </template>

    <template #footer="{ collapsed }">
      <UButton
        :label="collapsed ? '' : '设置'"
        icon="i-lucide-settings"
        color="neutral"
        variant="ghost"
        class="w-full"
      />
    </template>
  </UDashboardSidebar>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const open = ref(false)
const links = [
  {
    label: '叙事医学',
    icon: 'i-lucide-house',
  },
  {
    label: 'CSTAR',
    icon: 'i-lucide-users',
    children: [
      {
        label: 'Case',
      },
      {
        label: 'Story',
      },
    ],
  },
] satisfies NavigationMenuItem[]
</script>

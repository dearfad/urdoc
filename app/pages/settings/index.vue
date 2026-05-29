<template>
  <UDashboardPanel id="pages-settings">
    <template #header>
      <UDashboardNavbar title="设置">
        <template #leading>
          <UTooltip text="侧边栏">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>
    <template #body>
      <div v-for="(section, index) in sections" :key="index" class="mx-auto w-full lg:w-3/5">
        <UPageCard :title="section.title" :description="section.description" variant="naked" class="mb-4" />

        <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
          <UFormField
            v-for="field in section.fields"
            :key="field.name"
            :name="field.name"
            :label="field.label"
            :description="field.description"
            class="flex items-center justify-between gap-2 not-last:pb-4"
          >
            <UInput v-model="stateStore.version" autocomplete="off" />
            <USwitch v-model="state[field.name]" @update:model-value="onChange" />
          </UFormField>
        </UPageCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
definePageMeta({
  title: '设置',
})

import type { BreadcrumbItem } from '@nuxt/ui'
const items = ref<BreadcrumbItem[]>([
  {
    label: '概览',
    icon: 'i-lucide-house',
    to: '/dashboard',
  },
  {
    label: '设置',
    icon: 'i-lucide-settings',
    to: '/settings',
  },
])

const stateStore = useStateStore()

const state = reactive<{ [key: string]: boolean }>({
  email: true,
  desktop: false,
  product_updates: true,
  weekly_digest: false,
  important_updates: true,
})

const sections = [
  {
    title: '状态版本时间',
    description: 'Where can we notify you?',
    fields: [
      {
        name: 'state_store_version',
        label: 'state store version',
        description: 'Lastest state store version.',
      },
    ],
  },
  {
    title: 'Account updates',
    description: 'Receive updates about Nuxt UI.',
    fields: [
      {
        name: 'weekly_digest',
        label: 'Weekly digest',
        description: 'Receive a weekly digest of news.',
      },
    ],
  },
]

async function onChange() {
  // Do something with data
  // console.log(state)
}
</script>

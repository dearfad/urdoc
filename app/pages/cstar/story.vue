<template>
  <UDashboardPanel id="pages-cstar-story">
    <template #header>
      <UDashboardNavbar title="编写故事">
        <template #leading>
          <UTooltip text="侧边栏">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
        <template #right>
          <AppHeader />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <UBreadcrumb :items="items" />

      </UDashboardToolbar>
    </template>
    <template #body>
      <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto md:flex-row">
        <Story
          v-show="isDesktop || !settingsVisible"
          :settingsVisible="settingsVisible"
          class="flex min-h-0 w-full flex-col flex-1 md:flex-2"
          @toggleSettings="toggleSettings"
        />
        <StorySettings v-show="settingsVisible" class="flex min-h-0 w-full flex-col flex-1" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

definePageMeta({
  title: '编写故事',
})
const settingsVisible = ref(true)
const isDesktop = ref(true)

onMounted(() => {
  const mq = window.matchMedia('(min-width: 768px)')
  isDesktop.value = mq.matches
  settingsVisible.value = mq.matches
  mq.addEventListener('change', (e) => { isDesktop.value = e.matches })
})

function toggleSettings() {
  settingsVisible.value = !settingsVisible.value
}

const items = computed<BreadcrumbItem[]>(() => [
  { label: '概览', icon: 'i-lucide-house', to: '/dashboard' },
  { label: 'CSTAR', icon: 'i-lucide-circle-star' },
  { label: '编写故事', icon: 'i-mdi-alpha-s-circle', to: '/cstar/story' },
])
</script>

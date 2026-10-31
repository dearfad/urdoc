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
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <div
          v-show="isDesktop || !settingsVisible"
          class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-1 md:flex-2"
        >
          <Story
            :settingsVisible="settingsVisible"
            class="w-full max-h-[75vh]"
            @toggleSettings="toggleSettings"
          />
          <StoryContent
            type="conversation"
            title="对话"
            icon="i-lucide-messages-square"
            :depends-on="'story'"
            class="w-full max-h-[75vh]"
          />
          <StoryContent
            type="discussion"
            title="讨论"
            icon="i-lucide-message-circle"
            :depends-on="'conversation'"
            class="w-full max-h-[75vh]"
          />
          <StoryContent
            type="comment"
            title="点评"
            icon="i-lucide-star"
            :depends-on="'discussion'"
            class="w-full max-h-[75vh]"
          />
        </div>
        <StorySettings v-show="settingsVisible" class="flex min-h-0 w-full flex-col md:w-96 md:shrink-0" />
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

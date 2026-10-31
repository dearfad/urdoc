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
      <div class="flex min-h-0 flex-1 flex-col">
        <div
          class="flex items-center gap-1 border-b border-default bg-elevated/60 px-2 py-2 sm:px-4 overflow-x-auto"
        >
          <UButton
            v-for="tab in tabs"
            :key="tab.value"
            :icon="tab.icon"
            :variant="activeTab === tab.value ? 'solid' : 'ghost'"
            :color="activeTab === tab.value ? 'primary' : 'neutral'"
            size="md"
            class="shrink-0 rounded-full transition-all duration-200"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </UButton>
          <div class="ms-auto flex shrink-0 items-center">
            <UTooltip :text="settingsVisible ? '隐藏设置' : '显示设置'">
              <UButton
                :icon="settingsVisible ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
                variant="ghost"
                size="md"
                @click="toggleSettings"
              />
            </UTooltip>
          </div>
        </div>

        <div class="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
          <div
            v-show="isDesktop || !settingsVisible"
            class="flex min-h-0 flex-1 flex-col p-1 sm:p-2 md:min-w-0"
          >
            <Story
              v-show="activeTab === 'story'"
              :settings-visible="settingsVisible"
              class="h-full w-full"
              @toggle-settings="toggleSettings"
            />
            <Conversation v-show="activeTab === 'conversation'" class="h-full w-full" />
            <Discussion v-show="activeTab === 'discussion'" class="h-full w-full" />
            <Comment v-show="activeTab === 'comment'" class="h-full w-full" />
          </div>
          <StorySettings
            :scene="activeTab"
            v-show="settingsVisible"
            class="flex min-h-0 w-full flex-col md:w-96 md:max-w-96 md:basis-96 md:shrink-0"
          />
        </div>
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
const activeTab = ref<'story' | 'conversation' | 'discussion' | 'comment'>('story')

const tabs = [
  { label: '故事', value: 'story', icon: 'i-mdi-alpha-s-circle' },
  { label: '对话', value: 'conversation', icon: 'i-lucide-messages-square' },
  { label: '讨论', value: 'discussion', icon: 'i-lucide-message-circle' },
  { label: '点评', value: 'comment', icon: 'i-lucide-star' },
] as const

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

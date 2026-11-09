<template>
  <!-- 
        <FaceContentShow />
        <FaceContentPrompt />
        <FaceUtilsGenerate />
        <StoryContentIllustration />
        <CommonPutOSS />
        <StoryUtilsGenerateIllustration />
-->
  <UDashboardPanel id="pages-multimodal-image">
    <template #header>
      <UDashboardNavbar :title="t('sidebar.imageCreation')">
        <template #leading>
          <UTooltip :text="t('common.sidebar')">
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
      <RecordFlow />
      <div class="flex min-h-0 flex-1 flex-col">
        <div class="border-default bg-elevated/60 flex items-center gap-1 overflow-x-auto border-b px-2 py-2 sm:px-4">
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
            <UTooltip :text="settingsVisible ? t('common.hideSettings') : t('common.showSettings')">
              <UButton
                :icon="settingsVisible ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
                variant="ghost"
                size="md"
                @click="toggleSettings"
              />
            </UTooltip>
          </div>
        </div>

        <div class="m-1 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden sm:m-2 md:flex-row">
          <div v-show="isDesktop || !settingsVisible" class="flex min-h-0 flex-1 flex-col md:min-w-0">
            <Image :tab="activeTab" class="h-full w-full" />
          </div>
          <ImageSettings v-show="settingsVisible" class="h-full w-full md:w-96 md:max-w-96 md:shrink-0 md:basis-96" />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

definePageMeta({
  title: '图像创作',
})

const { t } = useI18n()
const localePath = useLocalePath()

const settingsVisible = ref(true)
const isDesktop = ref(true)
const activeTab = ref<'face' | 'illustration' | 'generate'>('face')

const tabs = computed(() => [
  { label: t('imageTabs.face'), value: 'face', icon: 'i-lucide-user' },
  { label: t('imageTabs.illustration'), value: 'illustration', icon: 'i-lucide-book-image' },
  { label: t('imageTabs.custom'), value: 'generate', icon: 'i-lucide-pencil' },
] as const)

onMounted(() => {
  const mq = window.matchMedia('(min-width: 768px)')
  isDesktop.value = mq.matches
  settingsVisible.value = mq.matches
  mq.addEventListener('change', (e) => {
    isDesktop.value = e.matches
  })
})

function toggleSettings() {
  settingsVisible.value = !settingsVisible.value
}

const items = computed<BreadcrumbItem[]>(() => [
  { label: t('sidebar.overview'), icon: 'i-lucide-house', to: localePath('/dashboard') },
  { label: t('sidebar.multimodal'), icon: 'i-lucide-file-stack' },
  { label: t('sidebar.imageCreation'), icon: 'i-lucide-image', to: localePath('/multimodal/image') },
])
</script>

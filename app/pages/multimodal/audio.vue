<template>
  <UDashboardPanel id="pages-multimodal-audio">
    <template #header>
      <UDashboardNavbar :title="t('sidebar.audioSynthesis')">
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
      <div class="flex flex-col gap-2 md:flex-row">
        <div class="w-full md:flex-2">
          <UCard
            :ui="{
              root: 'border border-default overflow-auto flex flex-col',
              header: 'bg-elevated flex items-center py-2',
              body: 'py-0 sm:py-2 flex-1 flex flex-col',
              footer: 'p-0 sm:p-0',
            }"
          >
            <template #header>
              <UButton icon="i-lucide-file-volume" variant="ghost" :to="localePath('/multimodal/audio')" />
              <span class="font-bold">{{ t('sidebar.audioSynthesis') }}</span>
              <div class="ms-auto flex gap-2">
                <UTooltip :text="settingsVisible ? t('common.closeSettings') : t('common.settings')">
                  <UButton
                    :icon="settingsVisible ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
                    variant="ghost"
                    @click="toggleSettings"
                  />
                </UTooltip>
                <ButtonAudio :text="textInput" />
              </div>
            </template>

            <template #default>
              <div class="border-b border-default p-4">
                <USelect
                  v-model="sourceType"
                  :items="sourceOptions"
                  :placeholder="t('audio.sourcePlaceholder')"
                  variant="soft"
                  size="lg"
                />
              </div>

              <div class="p-4">
                <UTextarea
                  v-model="textInput"
                  size="lg"
                  :rows="10"
                  :placeholder="t('audio.textPlaceholder')"
                  class="w-full"
                />
              </div>

              <div class="flex-1 border-t border-default flex items-center justify-center p-8">
                <p class="text-sm text-muted">{{ t('audio.hint') }}</p>
              </div>
            </template>

            <template #footer />
          </UCard>
        </div>
        <div v-show="settingsVisible" class="w-full md:flex-1">
          <UCard
            :ui="{
              root: 'border border-default',
              header: 'bg-elevated flex items-center py-2',
              body: 'p-4 space-y-3',
            }"
          >
            <template #header>
              <UIcon name="i-lucide-settings-2" class="mr-2 size-4" />
              <span class="font-bold">{{ t('audio.settingsTitle') }}</span>
            </template>
            <div class="space-y-3">
              <div>
                <p class="mb-1 text-xs text-muted">{{ t('common.model') }}</p>
                <SelectModel scene="audio" />
              </div>
              <hr class="border-t border-default" />
              <div class="flex items-center justify-between">
                <span class="text-sm">{{ t('audio.currentModel') }}</span>
                <span class="text-sm text-muted">{{ modelName }}</span>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

definePageMeta({
  title: '音频合成',
})

const { t } = useI18n()
const localePath = useLocalePath()

const settingsVisible = ref(true)

onMounted(() => {
  settingsVisible.value = window.innerWidth >= 768
})

function toggleSettings() {
  settingsVisible.value = !settingsVisible.value
}

const items = computed<BreadcrumbItem[]>(() => [
  { label: t('sidebar.overview'), icon: 'i-lucide-house', to: localePath('/dashboard') },
  { label: t('sidebar.multimodal'), icon: 'i-lucide-file-stack' },
  { label: t('sidebar.audioSynthesis'), icon: 'i-lucide-mic', to: localePath('/multimodal/audio') },
])
const caseStore = useCaseStore()
const storyStore = useStoryStore()
const testStore = useTestStore()
const rateStore = useRateStore()

const sourceType = ref('custom')
const textInput = ref('你好！我是智能语音助手 XiaoAI，英文名是 SmartVoice。当前系统版本 v2.5.0，发布于 2025 年 12 月。今天天气：晴，温度 22~28°C，湿度 45%。请注意防暑降温！如需帮助，请拨打 400-888-0000 或访问 www.example.com。感谢您的使用！')

const sourceOptions = computed(() => [
  { label: `✏️ ${t('audio.sourceCustom')}`, value: 'custom' },
  { label: `📋 ${t('audio.sourceCase')}`, value: 'case' },
  { label: `📖 ${t('audio.sourceStory')}`, value: 'story' },
  { label: `📝 ${t('audio.sourceTest')}`, value: 'test' },
  { label: `⭐ ${t('audio.sourceRate')}`, value: 'rate' },
])

function formatTestContent(content: string | null): string {
  if (!content) return ''
  try {
    const parsed = JSON.parse(content)
    if (typeof parsed === 'string') return parsed
    return Object.entries(parsed)
      .map(([k, v]) => `${k}：${v}`)
      .join('\n')
  } catch {
    return content
  }
}

function getSourceText(source: string): string {
  switch (source) {
    case 'case':
      return caseStore.markdown || ''
    case 'story':
      return storyStore.story.content || ''
    case 'test':
      return formatTestContent(testStore.test.content)
    case 'rate':
      return rateStore.rate.content || ''
    default:
      return ''
  }
}

watch(sourceType, (val) => {
  textInput.value = getSourceText(val)
})

const modelName = computed(
  () => {
    const m = useModelStore().activeModels.audio
    return m?.name ? `${m.provider} / ${m.name}` : t('common.notSelected')
  },
)

</script>

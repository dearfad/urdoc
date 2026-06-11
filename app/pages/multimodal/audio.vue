<template>
  <UDashboardPanel id="pages-multimodal-audio">
    <template #header>
      <UDashboardNavbar title="音频合成">
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
        <template #right v-if="siblings.length">
          <div class="flex gap-1 overflow-x-auto">
            <NuxtLink
              v-for="sib in siblings"
              :key="sib.to"
              :to="sib.to"
              class="size-6 flex items-center justify-center rounded-full text-[11px] font-bold leading-none transition-colors shrink-0"
              :class="route.path === sib.to
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-default hover:bg-muted'"
              :title="sib.label"
            >
              {{ sib.abbr }}
            </NuxtLink>
          </div>
        </template>
      </UDashboardToolbar>
    </template>
    <template #body>
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
              <UButton icon="i-lucide-file-volume" variant="ghost" to="/multimodal/audio" />
              <span class="font-bold">音频合成</span>
              <div class="ms-auto flex gap-2">
                <ButtonAudio :text="textInput" />
              </div>
            </template>

            <template #default>
              <div class="border-b border-default p-4">
                <USelect
                  v-model="sourceType"
                  :items="sourceOptions"
                  placeholder="选择文本来源..."
                  variant="soft"
                  size="lg"
                />
              </div>

              <div class="p-4">
                <UTextarea
                  v-model="textInput"
                  size="lg"
                  :rows="10"
                  placeholder="输入需要合成语音的文本，或选择上方来源自动填充"
                  class="w-full"
                />
              </div>

              <div class="flex-1 border-t border-default flex items-center justify-center p-8">
                <p class="text-sm text-muted">点击右上角按钮合成并播放语音</p>
              </div>
            </template>

            <template #footer />
          </UCard>
        </div>
        <div class="w-full md:flex-1">
          <UCard
            :ui="{
              root: 'border border-default',
              header: 'bg-elevated flex items-center py-2',
              body: 'p-4 space-y-3',
            }"
          >
            <template #header>
              <UIcon name="i-lucide-settings-2" class="mr-2 size-4" />
              <span class="font-bold">音频设置</span>
            </template>
            <div class="space-y-3">
              <div>
                <p class="mb-1 text-xs text-muted">模型</p>
                <SelectModel scene="audio" />
              </div>
              <hr class="border-t border-default" />
              <div class="flex items-center justify-between">
                <span class="text-sm">当前模型</span>
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
definePageMeta({
  title: '音频合成',
})

const route = useRoute()
const { items, siblings } = useBreadcrumb()
const caseStore = useCaseStore()
const storyStore = useStoryStore()
const testStore = useTestStore()
const rateStore = useRateStore()

const sourceType = ref('custom')
const textInput = ref('你好！我是智能语音助手 XiaoAI，英文名是 SmartVoice。当前系统版本 v2.5.0，发布于 2025 年 12 月。今天天气：晴，温度 22~28°C，湿度 45%。请注意防暑降温！如需帮助，请拨打 400-888-0000 或访问 www.example.com。感谢您的使用！')

const sourceOptions = [
  { label: '✏️ 自定义文本', value: 'custom' },
  { label: '📋 病例内容', value: 'case' },
  { label: '📖 故事内容', value: 'story' },
  { label: '📝 试题内容', value: 'test' },
  { label: '⭐ 评价内容', value: 'rate' },
]

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
    return m?.name ? `${m.provider} / ${m.name}` : '未选择'
  },
)

</script>

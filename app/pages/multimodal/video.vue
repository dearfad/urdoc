<template>
  <UDashboardPanel id="pages-multimodal-video">
    <template #header>
      <UDashboardNavbar title="影像渲染">
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
      <div class="flex flex-col gap-2 md:flex-row">
        <div class="w-full md:flex-2">
          <UCard
            id="component-video-index"
            :ui="{
              root: 'border border-default overflow-auto flex flex-col',
              header: 'bg-elevated flex items-center py-2',
              body: 'py-0 sm:py-2 flex-1 flex flex-col',
              footer: 'p-0 sm:p-0',
            }"
          >
            <template #header>
              <UButton icon="i-lucide-video" variant="ghost" to="/multimodal/video" />
              <span class="font-bold">影像渲染</span>
              <div class="ms-auto flex gap-2">
                <UTooltip :text="settingsVisible ? '关闭设定' : '设定'">
                  <UButton
                    :icon="settingsVisible ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
                    variant="ghost"
                    @click="toggleSettings"
                  />
                </UTooltip>
                <ButtonGenerate type="video" task="generate" label="生成视频" />
              </div>
            </template>

            <template #default>
              <div class="flex flex-col gap-2 border-b border-default p-4">
                <p class="text-sm text-muted">
                  基于当前 <NuxtLink to="/cstar/case" class="text-primary underline">病例</NuxtLink>、
                  <NuxtLink to="/cstar/story" class="text-primary underline">故事</NuxtLink>
                  和患者头像，使用图生视频生成一段医学教育视频。
                </p>
              </div>

              <div class="border-b border-default p-4">
                <p class="mb-2 text-sm font-semibold">患者头像</p>
                <div class="flex items-center gap-4">
                  <div
                    class="size-24 shrink-0 overflow-hidden rounded-xl border-2 border-default bg-muted"
                  >
                    <img
                      v-if="imageStore.images.length"
                      :src="imageStore.images[0].url"
                      alt="患者头像"
                      class="size-full object-cover"
                    />
                    <div v-else class="flex size-full items-center justify-center text-muted">
                      <UIcon name="i-lucide-user" class="size-8" />
                    </div>
                  </div>
                  <div class="text-sm text-muted">
                    <template v-if="imageStore.images.length">
                      头像已就绪，将作为参考图生成视频
                    </template>
                    <template v-else>
                      暂无头像，请先在
                      <NuxtLink to="/multimodal/image" class="text-primary underline">图像创作</NuxtLink>
                      中生成患者头像
                    </template>
                  </div>
                </div>
              </div>

              <div class="border-b border-default p-4">
                <p class="mb-2 text-sm font-semibold">病例摘要</p>
                <p v-if="caseContentStr" class="max-h-32 overflow-y-auto text-xs text-muted">
                  {{ caseContentStr }}
                </p>
                <p v-else class="text-xs text-muted">
                  暂无病例，请先
                  <NuxtLink to="/cstar/case" class="text-primary underline">生成病例</NuxtLink>
                </p>
              </div>

              <div class="border-b border-default p-4">
                <p class="mb-2 text-sm font-semibold">故事内容</p>
                <p v-if="storyContentStr" class="max-h-32 overflow-y-auto text-xs text-muted">
                  {{ storyContentStr }}
                </p>
                <p v-else class="text-xs text-muted">
                  暂无故事，请先
                  <NuxtLink to="/cstar/story" class="text-primary underline">编写故事</NuxtLink>
                </p>
              </div>

              <div class="flex-1 border-t border-default">
                <div v-if="videoStore.status === 'streaming'" class="flex flex-col items-center justify-center gap-3 p-8">
                  <USkeleton class="aspect-video w-full max-w-lg rounded-lg" />
                  <UProgress :value="videoStore.progress" class="w-full max-w-lg" />
                  <p class="text-sm text-muted">视频生成中... {{ videoStore.progress }}%</p>
                </div>
                <div v-else-if="videoStore.error" class="flex items-center justify-center p-8">
                  <p class="text-sm text-error">{{ videoStore.error }}</p>
                </div>
                <div v-else-if="videoStore.videoUrl" class="p-4">
                  <video
                    :src="videoStore.videoUrl"
                    controls
                    autoplay
                    class="w-full rounded-lg border border-default"
                  />
                </div>
                <div v-else class="flex items-center justify-center p-8">
                  <p class="text-sm text-muted">准备好病例、故事和患者头像后，点击「生成视频」</p>
                </div>
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
              <span class="font-bold">视频参数</span>
            </template>
            <div class="space-y-3">
              <div>
                <p class="mb-1 text-xs text-muted">模型</p>
                <SelectModel scene="video" />
              </div>
              <hr class="border-t border-default" />
              <div class="flex items-center justify-between">
                <span class="text-sm">分辨率</span>
                <span class="text-sm text-muted">1152×768</span>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span class="text-sm shrink-0">时长</span>
                <USelect
                  v-model="durationValue"
                  :items="durationOptions"
                  variant="soft"
                  size="sm"
                  class="min-w-0"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">帧数</span>
                <span class="text-sm text-muted">{{ displayFrames }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">帧率</span>
                <span class="text-sm text-muted">24 FPS</span>
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
import { DURATION_OPTIONS, getDurationByContent } from '~/stores/video'

definePageMeta({
  title: '影像渲染',
})
const settingsVisible = ref(true)

onMounted(() => {
  settingsVisible.value = window.innerWidth >= 768
})

function toggleSettings() {
  settingsVisible.value = !settingsVisible.value
}

const items = computed<BreadcrumbItem[]>(() => [
  { label: '概览', icon: 'i-lucide-house', to: '/dashboard' },
  { label: '多模态', icon: 'i-lucide-file-stack' },
  { label: '影像渲染', icon: 'i-lucide-video', to: '/multimodal/video' },
])

const videoStore = useVideoStore()
const imageStore = useImageStore()
const caseStore = useCaseStore()
const storyStore = useStoryStore()

const caseContentStr = computed(() => {
  const content = caseStore.case.content
  if (!content) return ''
  if (typeof content === 'string') return content
  return Object.entries(content)
    .map(([k, v]) => `${k}：${v}`)
    .join(' | ')
})

const storyContentStr = computed(() => {
  const s = storyStore.story.content
  if (!s) return ''
  return s.length > 200 ? s.slice(0, 200) + '...' : s
})

const autoLabel = computed(() => {
  const frames = getDurationByContent(storyStore.story.content || '')
  const opt = DURATION_OPTIONS.find((o) => o.frames === frames)
  return `自动（${opt?.label || '5 秒'}）`
})

const durationOptions = computed(() => {
  return [
    { label: autoLabel.value, value: 'auto' },
    ...DURATION_OPTIONS.map((o) => ({ label: o.label, value: o.frames })),
  ]
})

const durationValue = computed({
  get: () => videoStore.selectedFrames,
  set: (val: 'auto' | 81 | 121 | 161 | 241 | 441) => {
    videoStore.selectedFrames = val
  },
})

const displayFrames = computed(() => {
  const frames = videoStore.selectedFrames === 'auto'
    ? getDurationByContent(storyStore.story.content || '')
    : videoStore.selectedFrames
  const opt = DURATION_OPTIONS.find((o) => o.frames === frames)
  return `${frames}（${opt?.seconds || '~5s'}）`
})
</script>

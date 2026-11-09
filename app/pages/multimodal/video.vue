<template>
  <UDashboardPanel id="pages-multimodal-video">
    <template #header>
      <UDashboardNavbar :title="t('sidebar.videoRendering')">
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
            id="component-video-index"
            :ui="{
              root: 'border border-default overflow-auto flex flex-col',
              header: 'bg-elevated flex items-center py-2',
              body: 'py-0 sm:py-2 flex-1 flex flex-col',
              footer: 'p-0 sm:p-0',
            }"
          >
            <template #header>
              <UButton icon="i-lucide-video" variant="ghost" :to="localePath('/multimodal/video')" />
              <span class="font-bold">{{ t('sidebar.videoRendering') }}</span>
              <div class="ms-auto flex gap-2">
                <UTooltip :text="settingsVisible ? t('common.closeSettings') : t('common.settings')">
                  <UButton
                    :icon="settingsVisible ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
                    variant="ghost"
                    @click="toggleSettings"
                  />
                </UTooltip>
                <ButtonGenerate type="video" task="generate" :label="t('video.generate')" />
              </div>
            </template>

            <template #default>
              <div class="flex flex-col gap-2 border-b border-default p-4">
                <p class="text-sm text-muted">
                  {{ t('video.introPrefix') }}<NuxtLink :to="localePath('/cstar/case')" class="text-primary underline">{{ t('video.caseLink') }}</NuxtLink>{{ t('video.introMiddle') }}<NuxtLink :to="localePath('/cstar/story')" class="text-primary underline">{{ t('video.storyLink') }}</NuxtLink>{{ t('video.introSuffix') }}
                </p>
              </div>

              <div class="border-b border-default p-4">
                <p class="mb-2 text-sm font-semibold">{{ t('video.patientAvatar') }}</p>
                <div class="flex items-center gap-4">
                  <div
                    class="size-24 shrink-0 overflow-hidden rounded-xl border-2 border-default bg-muted"
                  >
                    <img
                      v-if="imageStore.faceImages.length"
                      :src="imageStore.faceImages[0].url"
                      :alt="t('video.patientAvatar')"
                      class="size-full object-cover"
                    />
                    <div v-else class="flex size-full items-center justify-center text-muted">
                      <UIcon name="i-lucide-user" class="size-8" />
                    </div>
                  </div>
                  <div class="text-sm text-muted">
                    <template v-if="imageStore.faceImages.length">
                      {{ t('video.avatarReady') }}
                    </template>
                    <template v-else>
                      {{ t('video.noAvatarPrefix') }}
                      <NuxtLink :to="localePath('/multimodal/image')" class="text-primary underline">{{ t('video.noAvatarLink') }}</NuxtLink>
                      {{ t('video.noAvatarSuffix') }}
                    </template>
                  </div>
                </div>
              </div>

              <div class="border-b border-default p-4">
                <p class="mb-2 text-sm font-semibold">{{ t('video.caseSummary') }}</p>
                <p v-if="caseContentStr" class="max-h-32 overflow-y-auto text-xs text-muted">
                  {{ caseContentStr }}
                </p>
                <p v-else class="text-xs text-muted">
                  {{ t('video.noCasePrefix') }}
                  <NuxtLink :to="localePath('/cstar/case')" class="text-primary underline">{{ t('video.noCaseLink') }}</NuxtLink>
                </p>
              </div>

              <div class="border-b border-default p-4">
                <p class="mb-2 text-sm font-semibold">{{ t('video.storyContent') }}</p>
                <p v-if="storyContentStr" class="max-h-32 overflow-y-auto text-xs text-muted">
                  {{ storyContentStr }}
                </p>
                <p v-else class="text-xs text-muted">
                  {{ t('video.noStoryPrefix') }}
                  <NuxtLink :to="localePath('/cstar/story')" class="text-primary underline">{{ t('video.noStoryLink') }}</NuxtLink>
                </p>
              </div>

              <div class="flex-1 border-t border-default">
                <div v-if="videoStore.status === 'streaming'" class="flex flex-col items-center justify-center gap-3 p-8">
                  <USkeleton class="aspect-video w-full max-w-lg rounded-lg" />
                  <UProgress :value="videoStore.progress" class="w-full max-w-lg" />
                  <p class="text-sm text-muted">{{ t('video.generating') }} {{ videoStore.progress }}%</p>
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
                  <p class="text-sm text-muted">{{ t('video.readyHint') }}</p>
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
              <span class="font-bold">{{ t('video.paramsTitle') }}</span>
            </template>
            <div class="space-y-3">
              <div>
                <p class="mb-1 text-xs text-muted">{{ t('common.model') }}</p>
                <SelectModel scene="video" />
              </div>
              <hr class="border-t border-default" />
              <div class="flex items-center justify-between">
                <span class="text-sm">{{ t('video.resolution') }}</span>
                <span class="text-sm text-muted">1152×768</span>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span class="text-sm shrink-0">{{ t('video.duration') }}</span>
                <USelect
                  v-model="durationValue"
                  :items="durationOptions"
                  variant="soft"
                  size="sm"
                  class="min-w-0"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">{{ t('video.frames') }}</span>
                <span class="text-sm text-muted">{{ displayFrames }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">{{ t('video.frameRate') }}</span>
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
  { label: t('sidebar.videoRendering'), icon: 'i-lucide-video', to: localePath('/multimodal/video') },
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
  return t('video.auto', { label: opt?.label || t('video.defaultDuration') })
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

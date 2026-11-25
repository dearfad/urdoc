<template>
  <ProjectPageShell
    id="pages-project-pedagogical-research-model-selection"
    :title="t('projectPage.pedagogicalResearch.modelSelection.title')"
  >
    <div class="mb-6">
      <h1 class="text-highlighted text-2xl font-semibold sm:text-3xl">
        {{ t('projectPage.pedagogicalResearch.modelSelection.title') }}
      </h1>
      <p class="text-muted mt-2 max-w-2xl text-sm leading-relaxed sm:text-base">
        {{ t('projectPage.pedagogicalResearch.modelSelection.description') }}
      </p>
    </div>

    <UTabs v-model="activeScene" :items="tabs" :content="true" variant="pill" size="lg" class="w-full">
      <template #content="{ item }">
        <div class="mt-6 space-y-6">
          <UCard :ui="{ header: 'p-4 sm:p-5', body: 'p-4 sm:p-5' }">
            <template #header>
              <div class="flex items-center gap-3">
                <span class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <UIcon :name="item.icon" class="size-5" />
                </span>
                <div class="min-w-0">
                  <h2 class="text-highlighted text-base font-semibold leading-tight">{{ item.label }}</h2>
                  <p class="text-muted mt-1 text-xs leading-relaxed">{{ item.description }}</p>
                </div>
              </div>
            </template>

            <div class="space-y-6">
              <p class="text-muted text-sm leading-relaxed">
                {{ t('projectPage.pedagogicalResearch.modelSelection.tabHint') }}
              </p>

              <SelectModelType :type="item.value" />

              <div class="border-default flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span class="text-muted">
                    {{ t('projectPage.pedagogicalResearch.modelSelection.currentProvider') }}
                    <span class="text-highlighted ml-1 font-medium">
                      {{ modelStore.activeModels[item.value]?.provider ?? '-' }}
                    </span>
                  </span>
                  <span class="text-muted">
                    {{ t('projectPage.pedagogicalResearch.modelSelection.currentModel') }}
                    <span class="text-highlighted ml-1 font-medium">
                      {{ modelStore.activeModels[item.value]?.name ?? '-' }}
                    </span>
                  </span>
                </div>
                <UButton
                  :to="localePath('/settings')"
                  :label="t('projectPage.pedagogicalResearch.modelSelection.configure')"
                  icon="i-lucide-settings-2"
                  color="neutral"
                  variant="subtle"
                  size="lg"
                />
              </div>
            </div>
          </UCard>

          <UCard :ui="{ header: 'p-4 sm:p-5', body: 'p-4 sm:p-5' }">
            <template #header>
              <div class="flex items-center gap-3">
                <span class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <UIcon name="i-lucide-git-compare" class="size-5" />
                </span>
                <div class="min-w-0">
                  <h2 class="text-highlighted text-base font-semibold leading-tight">
                    {{ t('projectPage.pedagogicalResearch.modelSelection.compareTitle') }}
                  </h2>
                  <p class="text-muted mt-1 text-xs leading-relaxed">
                    {{ t('projectPage.pedagogicalResearch.modelSelection.compareCountHint') }}
                  </p>
                </div>
              </div>
            </template>

            <div class="space-y-5">
              <UFormField :label="t('projectPage.pedagogicalResearch.modelSelection.compareCount')" class="max-w-xs">
                <USelect v-model="comparisonCounts[item.value]" :items="countOptions" size="lg" class="w-full" />
              </UFormField>

              <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <UCard
                  v-for="(model, index) in comparisonModels[item.value]"
                  :key="index"
                  :ui="{ header: 'p-3 sm:p-4', body: 'p-3 sm:p-4' }"
                >
                  <template #header>
                    <div class="flex items-center justify-between gap-3">
                      <span class="text-muted text-xs font-medium">
                        {{ t('projectPage.pedagogicalResearch.modelSelection.compareSlot', { index: index + 1 }) }}
                      </span>
                      <UBadge
                        :label="model.name || t('select.modelPlaceholder')"
                        color="primary"
                        variant="subtle"
                        size="sm"
                      />
                    </div>
                  </template>

                  <div class="space-y-4">
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <UFormField :label="t('projectPage.pedagogicalResearch.modelSelection.providerLabel')">
                        <USelect
                          :model-value="model.provider"
                          :items="providerOptions(item.value)"
                          :placeholder="t('select.providerPlaceholder')"
                          variant="soft"
                          size="lg"
                          class="w-full"
                          @update:model-value="(val) => onComparisonProvider(item.value, index, val)"
                        />
                      </UFormField>
                      <UFormField :label="t('projectPage.pedagogicalResearch.modelSelection.modelLabel')">
                        <USelect
                          :model-value="model.name"
                          :items="modelOptions(item.value, model.provider)"
                          :placeholder="t('select.modelPlaceholder')"
                          variant="soft"
                          size="lg"
                          class="w-full"
                          :disabled="!model.provider"
                          @update:model-value="(val) => onComparisonModel(item.value, index, val)"
                        />
                      </UFormField>
                      <UFormField
                        :label="t('projectPage.pedagogicalResearch.modelSelection.localModelLabel')"
                        :description="t('projectPage.pedagogicalResearch.modelSelection.localModelHint')"
                        class="sm:col-span-2"
                      >
                        <USelect
                          :model-value="model.localModel"
                          :items="localModelOptions[item.value]"
                          :placeholder="t('projectPage.pedagogicalResearch.modelSelection.localModelPlaceholder')"
                          variant="soft"
                          size="lg"
                          class="w-full"
                          :disabled="!isComfyUI(model)"
                          @update:model-value="(val) => onComparisonLocalModel(item.value, index, val)"
                        />
                      </UFormField>
                    </div>

                    <div
                      class="border-default bg-elevated/30 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center"
                    >
                      <span class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                        <UIcon :name="item.placeholderIcon" class="size-5" />
                      </span>
                      <p class="text-muted mt-3 text-sm">{{ item.placeholder }}</p>
                    </div>
                  </div>
                </UCard>
              </div>
            </div>
          </UCard>
        </div>
      </template>
    </UTabs>
  </ProjectPageShell>
</template>

<script setup lang="ts">
type ModelScene = 'chat' | 'image' | 'video' | 'audio'

interface ComparisonModel {
  provider: string
  name: string
  localModel: string
  apiKey: string
  baseURL: string
}

definePageMeta({
  title: '模型选择',
})

const { t } = useI18n()
const localePath = useLocalePath()
const modelStore = useModelStore()

const activeScene = ref<ModelScene>('chat')
const scenes: ModelScene[] = ['chat', 'image', 'video', 'audio']

const tabs = computed(() => [
  {
    label: t('settingsPage.sceneChat'),
    value: 'chat',
    icon: 'i-lucide-message-square',
    description: t('projectPage.pedagogicalResearch.modelSelection.chatDescription'),
    placeholderIcon: 'i-lucide-message-square-text',
    placeholder: t('projectPage.pedagogicalResearch.modelSelection.chatPlaceholder'),
  },
  {
    label: t('settingsPage.sceneImage'),
    value: 'image',
    icon: 'i-lucide-image',
    description: t('projectPage.pedagogicalResearch.modelSelection.imageDescription'),
    placeholderIcon: 'i-lucide-image',
    placeholder: t('projectPage.pedagogicalResearch.modelSelection.imagePlaceholder'),
  },
  {
    label: t('settingsPage.sceneVideo'),
    value: 'video',
    icon: 'i-lucide-video',
    description: t('projectPage.pedagogicalResearch.modelSelection.videoDescription'),
    placeholderIcon: 'i-lucide-video',
    placeholder: t('projectPage.pedagogicalResearch.modelSelection.videoPlaceholder'),
  },
  {
    label: t('settingsPage.sceneAudio'),
    value: 'audio',
    icon: 'i-lucide-music',
    description: t('projectPage.pedagogicalResearch.modelSelection.audioDescription'),
    placeholderIcon: 'i-lucide-music',
    placeholder: t('projectPage.pedagogicalResearch.modelSelection.audioPlaceholder'),
  },
])

const DEFAULT_COMPARE_COUNT = 2
const countOptions = [2, 3, 4, 5, 6, 7, 8].map((value) => ({ label: String(value), value }))

// 与设置页保持一致的本地 ComfyUI 工作流模型选项
const localModelOptions: Record<ModelScene, { label: string; value: string }[]> = {
  chat: [{ label: 'Qwen3 4B 本地文本生成', value: 'qwen3-text-gen' }],
  image: [
    { label: 'Qwen Image 2.1 Turbo', value: 'qwen-image-2.1-turbo' },
    { label: 'Z-Image Turbo', value: 'z-image-turbo' },
    { label: 'MiniMax H3 Image', value: 'minimax-h3-image' },
    { label: 'MOSS Image', value: 'moss-image' },
    { label: 'Krea 2', value: 'krea2-turbo' },
    { label: 'Qwen Image 2.1 Turbo Edit', value: 'qwen-image-2.1-turbo-edit' },
    { label: 'MiniMax H3 Image Edit', value: 'minimax-h3-image-edit' },
  ],
  video: [{ label: 'FastVideo FastH3（MiniMax H3 图生视频）', value: 'fastvideo-fasth3-i2v' }],
  audio: [],
}

function defaultLocalModel(scene: ModelScene): string {
  if (scene === 'chat') return modelStore.customModels.chat.chatTemplate ?? 'qwen3-text-gen'
  if (scene === 'image') return modelStore.customModels.image.t2iTemplate ?? 'z-image-turbo'
  if (scene === 'video') return modelStore.customModels.video.i2vTemplate ?? 'fastvideo-fasth3-i2v'
  return ''
}

function isComfyUI(model: ComparisonModel): boolean {
  return model.provider === 'Custom' && model.name.trim().toLowerCase() === 'comfyui'
}

function createComparisonModel(scene: ModelScene, index: number): ComparisonModel {
  if (index === 0) {
    const active = modelStore.activeModels[scene]
    if (active?.provider && active?.name) {
      return {
        provider: active.provider,
        name: active.name,
        localModel: defaultLocalModel(scene),
        apiKey: active.apiKey ?? '',
        baseURL: active.baseURL ?? '',
      }
    }
  }
  return { provider: '', name: '', localModel: defaultLocalModel(scene), apiKey: '', baseURL: '' }
}

const comparisonCounts = reactive<Record<ModelScene, number>>({
  chat: DEFAULT_COMPARE_COUNT,
  image: DEFAULT_COMPARE_COUNT,
  video: DEFAULT_COMPARE_COUNT,
  audio: DEFAULT_COMPARE_COUNT,
})

const comparisonModels = reactive<Record<ModelScene, ComparisonModel[]>>({
  chat: Array.from({ length: DEFAULT_COMPARE_COUNT }, (_, index) => createComparisonModel('chat', index)),
  image: Array.from({ length: DEFAULT_COMPARE_COUNT }, (_, index) => createComparisonModel('image', index)),
  video: Array.from({ length: DEFAULT_COMPARE_COUNT }, (_, index) => createComparisonModel('video', index)),
  audio: Array.from({ length: DEFAULT_COMPARE_COUNT }, (_, index) => createComparisonModel('audio', index)),
})

watch(comparisonCounts, (counts) => {
  for (const scene of scenes) {
    const list = comparisonModels[scene]
    const count = counts[scene]
    while (list.length < count) list.push(createComparisonModel(scene, list.length))
    if (list.length > count) list.splice(count)
  }
})

function providerOptions(scene: ModelScene) {
  return (modelStore.models[scene] ?? []).map((group) => ({ label: group.provider, value: group.provider }))
}

function modelOptions(scene: ModelScene, provider: string) {
  const group = (modelStore.models[scene] ?? []).find((item) => item.provider === provider)
  return group ? group.models.map((name) => ({ label: name, value: name })) : []
}

function onComparisonProvider(scene: ModelScene, index: number, value: unknown) {
  if (typeof value !== 'string') return
  const group = (modelStore.models[scene] ?? []).find((item) => item.provider === value)
  if (!group) return
  Object.assign(comparisonModels[scene][index], {
    provider: group.provider,
    name: group.models[0] ?? '',
    apiKey: group.apiKey,
    baseURL: group.baseURL,
  })
}

function onComparisonModel(scene: ModelScene, index: number, value: unknown) {
  if (typeof value !== 'string') return
  const model = comparisonModels[scene][index]
  const group = (modelStore.models[scene] ?? []).find((item) => item.provider === model.provider)
  if (!group) return
  model.name = value
  model.apiKey = group.apiKey
  model.baseURL = group.baseURL
}

function onComparisonLocalModel(scene: ModelScene, index: number, value: unknown) {
  if (typeof value !== 'string') return
  comparisonModels[scene][index].localModel = value
}
</script>

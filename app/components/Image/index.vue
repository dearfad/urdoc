<template>
  <UCard
    id="component-image-index"
    :ui="{
      root: 'border border-default flex min-h-0 flex-col overflow-hidden',
      header: 'bg-elevated flex items-center py-2',
      body: bodyClass,
      footer: 'p-0 sm:p-0',
    }"
  >
    <template #header>
      <UButton :icon="tabMeta.icon" variant="ghost" to="/multimodal/image" />
      <span class="font-bold">{{ tabMeta.label }}</span>
      <UBadge v-if="props.tab === 'illustration' && isBusy" color="info" variant="subtle" size="xs">
        <UIcon name="i-lucide-loader-circle" class="mr-1 size-3 animate-spin" />
        {{ stageText }}
      </UBadge>
      <div class="ms-auto flex items-center gap-2">
        <div v-if="props.tab === 'illustration' && (hasScenes || hasDetailPrompts)" class="flex items-center gap-1">
          <UTooltip v-if="hasScenes" :text="t('image.copyPrompt')">
            <ButtonClipboard :text="scenesText" />
          </UTooltip>
          <UTooltip v-if="hasDetailPrompts" :text="t('image.copyPrompt')">
            <ButtonClipboard :text="detailPromptsText" />
          </UTooltip>
        </div>
        <UButton
          icon="i-lucide-sparkles"
          :label="tabMeta.action"
          color="primary"
          variant="soft"
          size="sm"
          class="rounded-full"
          :loading="isBusy && lastAction === 'generate'"
          :disabled="imageStore.isGenerating"
          @click="runGenerate"
        />
        <UButton
          v-if="props.tab === 'face'"
          icon="i-lucide-refresh-cw"
          :label="t('image.regeneratePatientAvatar')"
          color="neutral"
          variant="outline"
          size="sm"
          class="rounded-full"
          :loading="isBusy && lastAction === 'regenerate'"
          :disabled="imageStore.isGenerating || !hasFacePrompt"
          @click="runRegenerateFace"
        />
      </div>
    </template>

    <template #default>
      <template v-if="tab === 'illustration'">
        <!-- 插图：每组一张卡片，编号、图片、情节与提示词统一收纳 -->
        <div class="flex flex-col gap-3">
          <div
            v-for="row in illustrationRows"
            :key="row.index"
            class="border-default bg-elevated/40 hover:border-primary/30 overflow-hidden rounded-xl border shadow-sm transition-colors"
          >
            <div
              class="border-default from-primary/5 flex items-center gap-2 border-b bg-linear-to-r to-transparent px-3 py-2 sm:px-4"
            >
              <span
                class="bg-primary/10 text-primary ring-primary/20 flex size-6 items-center justify-center rounded-md text-xs font-bold ring-1"
              >
                {{ row.index }}
              </span>
              <span class="text-highlighted text-sm font-semibold">{{ t('imageTabs.illustration') }}</span>
            </div>
            <div class="grid gap-3 p-3 sm:p-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <!-- 情节 -->
              <div class="order-2 flex min-h-48 min-w-0 flex-col">
                <div class="border-default mb-3 flex items-center gap-2 border-b pb-2">
                  <UIcon name="i-lucide-list-ordered" class="text-primary size-3.5" />
                  <span class="text-muted text-xs font-semibold">{{ t('image.sceneTitle') }}</span>
                  <div v-if="row.scene" class="ms-auto">
                    <UTooltip :text="t('image.copyPrompt')">
                      <ButtonClipboard :text="row.scene" />
                    </UTooltip>
                  </div>
                </div>
                <div
                  :ref="isSceneStage && row.index === 1 ? bindSceneBox : undefined"
                  class="bg-default/60 border-default min-h-24 min-w-0 flex-1 overflow-y-auto rounded-lg border p-3 text-sm leading-relaxed shadow-inner"
                >
                  <p
                    v-if="isSceneStage && row.index === 1 && imageStore.illustrationSceneText"
                    v-text="imageStore.illustrationSceneText"
                    class="text-highlighted prompt-streaming text-sm leading-relaxed wrap-break-word whitespace-pre-wrap"
                  />
                  <p
                    v-else-if="row.scene"
                    v-text="row.scene"
                    class="text-highlighted text-sm leading-relaxed wrap-break-word whitespace-pre-wrap"
                  />
                  <div v-else class="text-muted flex h-10 items-center justify-center gap-2 text-xs">
                    <UIcon
                      v-if="isSceneStage && row.index === 1"
                      name="i-lucide-loader-circle"
                      class="size-4 animate-spin"
                    />
                    <span>{{
                      isSceneStage && row.index === 1 ? t('image.sceneReceiving') : t('image.sceneEmpty')
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- 图片提示词 -->
              <div
                class="border-default bg-default/40 order-3 flex min-w-0 flex-col overflow-hidden rounded-lg border md:col-span-2"
              >
                <div class="border-default bg-elevated/50 flex items-center gap-2 border-b px-3 py-2">
                  <UIcon name="i-lucide-wand-sparkles" class="text-primary size-3.5" />
                  <span class="text-muted text-xs font-semibold">{{ t('image.detailPromptTitle') }}</span>
                  <div v-if="row.detail" class="ms-auto flex items-center">
                    <UTooltip :text="t('image.copyPrompt')">
                      <ButtonClipboard :text="row.detail" />
                    </UTooltip>
                  </div>
                </div>
                <div
                  :ref="isDetailStage && row.index === streamingDetailRow ? bindDetailBox : undefined"
                  class="min-h-16 p-3 text-sm leading-relaxed"
                >
                  <p
                    v-if="isDetailStage && row.index === streamingDetailRow && imageStore.illustrationDetailText"
                    v-text="imageStore.illustrationDetailText"
                    class="text-highlighted prompt-streaming text-sm leading-relaxed wrap-break-word whitespace-pre-wrap"
                  />
                  <p
                    v-else-if="row.detail"
                    v-text="row.detail"
                    class="text-highlighted text-sm leading-relaxed wrap-break-word whitespace-pre-wrap"
                  />
                  <div v-else class="text-muted flex h-10 items-center justify-center gap-2 text-xs">
                    <UIcon
                      v-if="isDetailStage && row.index === streamingDetailRow"
                      name="i-lucide-loader-circle"
                      class="size-4 animate-spin"
                    />
                    <span>
                      {{
                        isDetailStage && row.index === streamingDetailRow
                          ? t('image.detailReceiving')
                          : t('image.detailEmpty')
                      }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 图片 -->
              <div
                class="border-default bg-default/50 order-1 flex min-h-48 min-w-0 flex-col overflow-hidden rounded-lg border"
              >
                <div class="border-default bg-elevated/60 flex items-center gap-2 border-b px-3 py-2">
                  <UIcon name="i-lucide-image" class="text-primary size-3.5" />
                  <span class="text-muted text-xs font-semibold">{{ t('image.imageLabel') }}</span>
                </div>
                <div class="relative flex min-h-40 flex-1 items-center justify-center p-3">
                  <img
                    v-if="row.image"
                    :src="row.image.url"
                    :alt="`${tabMeta.label} ${row.index}`"
                    class="max-h-56 w-full object-contain"
                  />
                  <template v-else-if="isImageStage && row.index === currentImages.length + 1">
                    <USkeleton class="absolute inset-0 rounded-lg" />
                    <div class="relative flex flex-col items-center gap-2 text-center">
                      <UIcon name="i-lucide-loader-circle" class="text-primary size-6 animate-spin" />
                      <span class="text-muted text-xs">{{ t('image.imageGenerating') }}</span>
                    </div>
                  </template>
                  <div v-else class="text-muted flex flex-col items-center gap-2 text-center text-xs">
                    <UIcon :name="tabMeta.icon" class="size-6" />
                    <span>{{ t('image.emptyIllustration') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 提示词区：移动端位于图片下方，桌面端占右侧 1/3 -->
        <div
          class="border-default bg-elevated/40 relative order-2 flex w-full shrink-0 flex-col overflow-hidden rounded-xl border p-4 shadow-sm sm:w-1/3 sm:shrink"
        >
          <template v-if="tab === 'generate'">
            <div class="mb-2 flex items-center gap-2">
              <span class="text-highlighted flex items-center gap-2 text-lg font-semibold">
                <span
                  class="from-primary/20 to-primary/5 flex size-6 items-center justify-center rounded-md bg-linear-to-br"
                >
                  <UIcon name="i-lucide-file-text" class="text-primary size-3.5" />
                </span>
                {{ t('image.imagePrompt') }}
              </span>
            </div>
            <UTextarea
              v-model="imageStore.prompt"
              size="lg"
              fixed
              :rows="4"
              :placeholder="t('image.imagePromptPlaceholder')"
              class="min-h-16 w-full sm:flex-1"
              :ui="{
                base: 'border border-default bg-default/60 rounded-lg p-4 shadow-inner text-highlighted text-base leading-6.5 wrap-break-word whitespace-pre-wrap placeholder:text-muted resize-none sm:h-full sm:overflow-y-auto',
              }"
            />
          </template>
          <template v-else>
            <div class="mb-2 flex items-center gap-2">
              <span class="text-highlighted flex items-center gap-2 text-lg font-semibold">
                <span
                  class="from-primary/20 to-primary/5 flex size-6 items-center justify-center rounded-md bg-linear-to-br"
                >
                  <UIcon name="i-lucide-file-text" class="text-primary size-3.5" />
                </span>
                {{ t('common.prompt') }}
              </span>
              <UBadge v-if="isPromptStage" color="info" variant="subtle" size="xs">
                <UIcon name="i-lucide-loader-circle" class="mr-1 size-3 animate-spin" />
                {{ t('image.generating') }}
              </UBadge>
              <UBadge v-else-if="hasPrompt" color="success" variant="subtle" size="xs">{{ t('image.ready') }}</UBadge>
              <div v-if="hasPrompt" class="ms-auto flex items-center">
                <UTooltip :text="t('image.copyPrompt')">
                  <ButtonClipboard :text="promptText" />
                </UTooltip>
              </div>
            </div>
            <div
              ref="promptBox"
              class="bg-default/60 border-default min-h-16 rounded-lg border p-4 shadow-inner sm:flex-1 sm:overflow-y-auto"
            >
              <p
                v-if="hasPrompt"
                v-text="promptText"
                class="text-highlighted text-base leading-relaxed wrap-break-word whitespace-pre-wrap"
                :class="{ 'prompt-streaming': isPromptStage }"
              />
              <div v-else class="text-muted flex h-10 items-center justify-center gap-2 text-base">
                <UIcon v-if="isPromptStage" name="i-lucide-loader-circle" class="size-4 animate-spin" />
                <span>{{ isPromptStage ? t('image.receivingOutput') : t('image.emptyPrompt') }}</span>
              </div>
            </div>
          </template>
        </div>

        <!-- 图片结果区：移动端位于提示词上方，桌面端占左侧 2/3 -->
        <div
          class="relative order-1 flex h-72 w-full shrink-0 items-center justify-center sm:h-auto sm:w-2/3 sm:shrink"
        >
          <div
            v-if="isBusy && currentImages.length"
            class="bg-default/70 absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 backdrop-blur-sm"
          >
            <UIcon name="i-lucide-loader-circle" class="text-primary size-8 animate-spin" />
            <span class="text-muted text-xs font-medium">
              {{ isPromptStage ? stageText : t('image.regenerating', { label: tabMeta.label }) }}
            </span>
          </div>
          <div
            v-if="isBusy && !currentImages.length"
            class="flex h-full w-full flex-col items-center justify-center gap-4"
          >
            <div
              class="border-default bg-elevated/40 relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border p-4 shadow-sm"
            >
              <USkeleton class="absolute inset-0 rounded-xl" />
              <div class="relative flex flex-col items-center gap-2 px-3 text-center">
                <UIcon name="i-lucide-loader-circle" class="text-primary size-8 animate-spin" />
                <span class="text-muted text-xs font-medium">
                  {{ isPromptStage ? stageText : t('image.generatingWithLabel', { label: tabMeta.label }) }}
                </span>
              </div>
            </div>
          </div>
          <div
            v-else-if="imageStore.error"
            class="border-default bg-elevated/40 flex h-full w-full items-center justify-center rounded-xl border p-4 text-center shadow-sm"
          >
            <p class="text-error text-sm">{{ imageStore.error }}</p>
          </div>
          <div v-else-if="currentImages.length" class="flex h-full w-full flex-col">
            <div class="grid h-full grid-cols-1">
              <div
                v-for="(img, i) in currentImages"
                :key="i"
                class="border-default bg-elevated/40 flex h-full w-full flex-col overflow-hidden rounded-xl border p-4 shadow-sm"
              >
                <img :src="img.url" :alt="`${tabMeta.label} ${i + 1}`" class="min-h-0 w-full flex-1 object-contain" />
              </div>
              <div
                v-for="n in remainingImages"
                :key="`sk-${n}`"
                class="border-default bg-elevated/40 relative flex min-h-40 items-center justify-center overflow-hidden rounded-xl border p-4 shadow-sm"
              >
                <USkeleton class="absolute inset-0" />
                <div class="text-muted relative flex flex-col items-center gap-2 text-xs">
                  <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin" />
                  <span>{{ t('image.imageGenerating') }}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            class="border-default bg-elevated/40 flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border p-4 text-center shadow-sm"
          >
            <div class="bg-muted rounded-full p-4">
              <UIcon :name="tabMeta.icon" class="text-muted size-8" />
            </div>
            <p class="text-muted text-sm">{{ tabMeta.empty }}</p>
          </div>
        </div>
      </template>
    </template>

    <template #footer />
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
  tab: { type: String, default: 'face' },
})

const { t } = useI18n()
const imageStore = useImageStore()

type ImageTab = 'face' | 'illustration' | 'generate'

const tabConfig = computed<Record<ImageTab, { label: string; action: string; icon: string; empty: string }>>(() => ({
  face: {
    label: t('image.patientAvatar'),
    action: t('image.generatePatientAvatar'),
    icon: 'i-lucide-user',
    empty: t('image.emptyAvatar'),
  },
  illustration: {
    label: t('image.illustration'),
    action: t('image.generateIllustration'),
    icon: 'i-lucide-book-image',
    empty: t('image.emptyIllustration'),
  },
  generate: {
    label: t('image.custom'),
    action: t('image.generateCustom'),
    icon: 'i-lucide-pencil',
    empty: t('image.emptyCustom'),
  },
}))

const tabMeta = computed(() => tabConfig.value[props.tab as ImageTab] ?? tabConfig.value.face)

// 插图采用整块行式布局，其余标签沿用「提示词 + 图片」双栏布局
const bodyClass = computed(() =>
  props.tab === 'illustration'
    ? 'flex-1 flex min-h-0 flex-col overflow-y-auto p-3 sm:p-4'
    : 'flex-1 flex min-h-0 flex-col gap-3 overflow-y-auto p-3 sm:flex-row sm:overflow-hidden sm:gap-4 sm:p-4',
)

const isBusy = computed(() => imageStore.isGenerating && imageStore.currentTask === props.tab)
const isSceneStage = computed(() => isBusy.value && imageStore.currentPhase === 'scene')
const isDetailStage = computed(() => isBusy.value && imageStore.currentPhase === 'prompt')
const isPromptStage = computed(() => isSceneStage.value || isDetailStage.value)
const isImageStage = computed(() => isBusy.value && imageStore.currentPhase === 'image')

const stageText = computed(() => {
  if (isSceneStage.value) return t('image.sceneStage')
  if (isDetailStage.value) return t('image.detailStage')
  if (isImageStage.value) return t('image.generatingWithLabel', { label: tabMeta.value.label })
  return ''
})

// 插图两步中间产物：关键情节描述与详细文生图提示词
const hasScenes = computed(() => imageStore.illustrationScenes.length > 0)
const scenesText = computed(() => imageStore.illustrationScenes.map((scene, i) => `${i + 1}. ${scene}`).join('\n\n'))
const hasDetailPrompts = computed(() => imageStore.illustrationDetailPrompts.length > 0)
const detailPromptsText = computed(() =>
  imageStore.illustrationDetailPrompts.map((prompt, i) => `${i + 1}. ${prompt}`).join('\n\n'),
)

// 插图固定 4 组：同一行内依次展示情节、图片提示词与生成的图片
const ILLUSTRATION_COUNT = 4
const illustrationRows = computed(() =>
  Array.from({ length: ILLUSTRATION_COUNT }, (_, i) => ({
    index: i + 1,
    scene: imageStore.illustrationScenes[i] ?? '',
    detail: imageStore.illustrationDetailPrompts[i] ?? '',
    image: imageStore.illustrationImages[i] ?? null,
  })),
)
const streamingDetailRow = computed(() => imageStore.illustrationDetailPrompts.length + 1)

// 区分当前正在进行的操作，避免两个按钮同时显示加载状态
const lastAction = ref<'generate' | 'regenerate'>('generate')
const hasFacePrompt = computed(() => !!(imageStore.facePromptText.trim() || imageStore.facePrompts[0]?.trim()))

const promptText = computed(() => (props.tab === 'face' ? imageStore.facePromptText : ''))
const hasPrompt = computed(() => !!promptText.value.trim())
const promptBox = ref<HTMLElement | null>(null)
const sceneBox = ref<HTMLElement | null>(null)
const detailBox = ref<HTMLElement | null>(null)

// 行式布局中仅当前流式行绑定滚动容器
function bindSceneBox(el: unknown) {
  if (el instanceof HTMLElement) sceneBox.value = el
}
function bindDetailBox(el: unknown) {
  if (el instanceof HTMLElement) detailBox.value = el
}

// 流式输出时始终展示最新到达的文本，并按当前阶段滚动对应面板
watch([promptText, () => imageStore.illustrationSceneText, () => imageStore.illustrationDetailText], () => {
  if (!isPromptStage.value) return
  nextTick(() => {
    const box = isSceneStage.value ? sceneBox.value : isDetailStage.value ? detailBox.value : promptBox.value
    if (box) box.scrollTop = box.scrollHeight
  })
})

// 根据当前标签页展示对应任务已生成的图片（头像与插图分开保存，互不覆盖）
const currentImages = computed<{ url: string; prompt: string }[]>(() => {
  if (props.tab === 'face') return imageStore.faceImages
  if (props.tab === 'illustration') return imageStore.illustrationImages
  return imageStore.generateImages
})

// 生成过程中，尚未生成的占位骨架数量（头像与自定义均为 1 张）
const remainingImages = computed(() => {
  if (!isImageStage.value) return 0
  return Math.max(0, 1 - currentImages.value.length)
})

function runGenerate() {
  lastAction.value = 'generate'
  const task =
    props.tab === 'face'
      ? imageStore.face()
      : props.tab === 'illustration'
        ? imageStore.illustration()
        : imageStore.generate()
  task.catch(() => {})
}

function runRegenerateFace() {
  if (!hasFacePrompt.value || imageStore.isGenerating) return
  lastAction.value = 'regenerate'
  imageStore.regenerateFace().catch(() => {})
}
</script>

<style scoped>
.prompt-streaming::after {
  content: '';
  display: inline-block;
  width: 6px;
  height: 12px;
  margin-left: 2px;
  vertical-align: middle;
  border-radius: 1px;
  background-color: currentColor;
  animation: prompt-blink 1s steps(2, start) infinite;
}

@keyframes prompt-blink {
  to {
    opacity: 0;
  }
}
</style>

<template>
  <UCard
    id="component-image-index"
    :ui="{
      root: 'border border-default flex min-h-0 flex-col overflow-hidden',
      header: 'bg-elevated flex items-center py-2',
      body: tab === 'face' ? 'flex-1 flex min-h-0 overflow-hidden gap-3 p-3 sm:flex-row sm:gap-4 sm:p-4' : 'py-0 sm:py-2 flex-1 flex flex-col min-h-0 overflow-hidden',
      footer: 'p-0 sm:p-0',
    }"
  >
    <template #header>
      <UButton :icon="tabMeta.icon" variant="ghost" to="/multimodal/image" />
      <span class="font-bold">{{ tabMeta.label }}</span>
      <div class="ms-auto flex items-center gap-2">
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
      <!-- 提示词区：头像标签在右占 1/3 并作卡片装饰，其余标签位于上方 -->
      <div
        :class="
          tab === 'face'
            ? 'relative order-2 flex min-h-0 w-full flex-col overflow-hidden rounded-xl border border-default bg-elevated/40 p-4 shadow-sm sm:w-1/3'
            : 'border-default shrink-0 border-b p-3 sm:p-4'
        "
      >
        <template v-if="tab === 'generate'">
          <div class="text-muted mb-2 flex items-center gap-1.5 text-xs font-semibold">
            <UIcon name="i-lucide-file-text" class="size-3.5" />
            {{ t('image.imagePrompt') }}
          </div>
          <UTextarea
            v-model="imageStore.prompt"
            size="lg"
            :rows="3"
            :placeholder="t('image.imagePromptPlaceholder')"
            class="w-full"
          />
        </template>
        <template v-else>
          <div class="mb-2 flex items-center gap-2">
            <span
              :class="
                tab === 'face'
                  ? 'text-highlighted flex items-center gap-2 text-lg font-semibold'
                  : 'text-muted flex items-center gap-1.5 text-xs font-semibold'
              "
            >
              <span
                v-if="tab === 'face'"
                class="from-primary/20 to-primary/5 flex size-6 items-center justify-center rounded-md bg-linear-to-br"
              >
                <UIcon name="i-lucide-file-text" class="text-primary size-3.5" />
              </span>
              <UIcon v-else name="i-lucide-file-text" class="size-3.5" />
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
            :class="
              tab === 'face'
                ? 'bg-default/60 border-default min-h-16 flex-1 overflow-y-auto rounded-lg border p-4 shadow-inner'
                : 'bg-elevated/50 border-default max-h-40 min-h-16 overflow-y-auto rounded-lg border p-3'
            "
          >
            <p
              v-if="hasPrompt"
              v-text="promptText"
              class="text-highlighted leading-relaxed wrap-break-word whitespace-pre-wrap"
              :class="[tab === 'face' ? 'text-base' : 'text-xs', { 'prompt-streaming': isPromptStage }]"
            />
            <div
              v-else
              :class="
                tab === 'face'
                  ? 'text-muted flex h-10 items-center justify-center gap-2 text-base'
                  : 'text-muted flex h-10 items-center justify-center gap-2 text-xs'
              "
            >
              <UIcon v-if="isPromptStage" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              <span>{{ isPromptStage ? t('image.receivingOutput') : t('image.emptyPrompt') }}</span>
            </div>
          </div>
        </template>
      </div>

      <!-- 图片结果区：头像标签在左占 2/3 并撑满高度，其余标签位于下方并可滚动 -->
      <div
        :class="
          tab === 'face'
            ? 'relative order-1 flex min-h-0 w-full items-center justify-center sm:w-2/3'
            : 'relative min-h-0 flex-1 overflow-y-auto p-3 sm:p-4'
        "
      >
        <div
          v-if="isBusy && currentImages.length"
          class="bg-default/70 absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 backdrop-blur-sm"
        >
          <UIcon name="i-lucide-loader-circle" class="text-primary size-8 animate-spin" />
          <span class="text-muted text-xs font-medium">
            {{ isPromptStage ? t('image.conceivingPrompt') : t('image.regenerating', { label: tabMeta.label }) }}
          </span>
        </div>
        <div
          v-if="isBusy && !currentImages.length"
          :class="
            tab === 'face'
              ? 'flex h-full w-full flex-col items-center justify-center gap-4'
              : 'flex h-full min-h-56 flex-col items-center justify-center gap-4'
          "
        >
          <div
            :class="
              tab === 'face'
                ? 'relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-default bg-elevated/40 p-4 shadow-sm'
                : 'border-default bg-elevated/60 relative flex aspect-square w-44 items-center justify-center overflow-hidden rounded-xl border sm:w-52'
            "
          >
            <USkeleton class="absolute inset-0 rounded-xl" />
            <div class="relative flex flex-col items-center gap-2 px-3 text-center">
              <UIcon name="i-lucide-loader-circle" class="text-primary size-8 animate-spin" />
              <span class="text-muted text-xs font-medium">
                {{ isPromptStage ? t('image.conceivingPrompt') : t('image.generatingWithLabel', { label: tabMeta.label }) }}
              </span>
            </div>
          </div>
          <p v-if="tab !== 'face'" class="text-muted text-xs">
            {{ isPromptStage ? t('image.afterPromptTip') : t('image.imageGeneratingTip') }}
          </p>
        </div>
        <div
          v-else-if="imageStore.error"
          :class="tab === 'face' ? 'flex h-full w-full items-center justify-center rounded-xl border border-default bg-elevated/40 p-4 text-center shadow-sm' : 'flex items-center justify-center p-8'"
        >
          <p class="text-error text-sm">{{ imageStore.error }}</p>
        </div>
        <div v-else-if="currentImages.length" :class="tab === 'face' ? 'h-full w-full' : ''">
          <div :class="tab === 'face' ? 'grid h-full grid-cols-1' : 'grid grid-cols-1 gap-3 sm:grid-cols-2'">
            <div
              v-for="(img, i) in currentImages"
              :key="i"
              :class="
                tab === 'face'
                  ? 'flex h-full w-full flex-col overflow-hidden rounded-xl border border-default bg-elevated/40 p-4 shadow-sm'
                  : 'border-default flex flex-col overflow-hidden rounded-lg border'
              "
            >
              <img
                :src="img.url"
                :alt="`${tabMeta.label} ${i + 1}`"
                :class="tab === 'face' ? 'min-h-0 w-full flex-1 object-contain' : 'w-full object-cover'"
              />
              <!-- 头像的最终提示词已在上方展示；多图任务逐张保留各自提示词 -->
              <div v-if="tab !== 'face'" class="border-default bg-elevated/50 border-t p-3">
                <div class="mb-1.5 flex items-center justify-between gap-2">
                  <span class="text-muted flex items-center gap-1 text-xs font-semibold">
                    <UIcon name="i-lucide-file-text" class="size-3.5" />
                    {{ t('common.prompt') }}
                  </span>
                  <UTooltip v-if="img.prompt" :text="t('image.copyPrompt')">
                    <ButtonClipboard :text="img.prompt" />
                  </UTooltip>
                </div>
                <p
                  v-if="img.prompt"
                  v-text="img.prompt"
                  class="text-muted max-h-28 overflow-y-auto text-xs leading-relaxed wrap-break-word whitespace-pre-wrap"
                />
                <p v-else class="text-muted text-xs">{{ t('image.emptyPromptRecord') }}</p>
              </div>
            </div>
            <div
              v-for="n in remainingImages"
              :key="`sk-${n}`"
              :class="
                tab === 'face'
                  ? 'relative flex h-full items-center justify-center rounded-xl border border-default bg-elevated/40 p-4 shadow-sm'
                  : 'border-default relative flex min-h-48 items-center justify-center overflow-hidden rounded-lg border'
              "
            >
              <USkeleton class="absolute inset-0" />
              <div class="text-muted relative flex flex-col items-center gap-2 text-xs">
                <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin" />
                <span>{{ t('image.imageGenerating') }}</span>
              </div>
            </div>
          </div>
          <p v-if="isImageStage && tab !== 'face'" class="text-muted mt-3 text-center text-xs">
            {{ t('image.generatingMore') }}
          </p>
        </div>
        <div
          v-else
          :class="
            tab === 'face'
              ? 'flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-default bg-elevated/40 p-4 text-center shadow-sm'
              : 'flex h-full min-h-40 flex-col items-center justify-center gap-3 px-4 text-center'
          "
        >
          <div class="bg-muted rounded-full p-4">
            <UIcon :name="tabMeta.icon" class="text-muted size-8" />
          </div>
          <p class="text-muted text-sm">{{ tabMeta.empty }}</p>
        </div>
      </div>
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

const isBusy = computed(() => imageStore.isGenerating && imageStore.currentTask === props.tab)
const isPromptStage = computed(() => isBusy.value && imageStore.currentPhase === 'prompt')
const isImageStage = computed(() => isBusy.value && imageStore.currentPhase === 'image')

// 区分当前正在进行的操作，避免两个按钮同时显示加载状态
const lastAction = ref<'generate' | 'regenerate'>('generate')
const hasFacePrompt = computed(() => !!(imageStore.facePromptText.trim() || imageStore.facePrompts[0]?.trim()))

const promptText = computed(() => {
  if (props.tab === 'face') return imageStore.facePromptText
  if (props.tab === 'illustration') return imageStore.illustrationPromptText
  return ''
})
const hasPrompt = computed(() => !!promptText.value.trim())
const promptBox = ref<HTMLElement | null>(null)

// 流式输出时始终展示最新到达的文本
watch(promptText, () => {
  if (!isPromptStage.value || !promptBox.value) return
  nextTick(() => {
    if (promptBox.value) promptBox.value.scrollTop = promptBox.value.scrollHeight
  })
})

// 根据当前标签页展示对应任务已生成的图片（头像与插图分开保存，互不覆盖）
const currentImages = computed<{ url: string; prompt: string }[]>(() => {
  if (props.tab === 'face') return imageStore.faceImages
  if (props.tab === 'illustration') return imageStore.illustrationImages
  return imageStore.generateImages
})

// 生成过程中，尚未生成的占位骨架数量（插图预期 4 张，其余 1 张）
const remainingImages = computed(() => {
  if (!isImageStage.value) return 0
  const expected = props.tab === 'illustration' ? 4 : 1
  return Math.max(0, expected - currentImages.value.length)
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

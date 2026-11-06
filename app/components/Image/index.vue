<template>
  <UCard
    id="component-image-index"
    :ui="{
      root: 'border border-default flex min-h-0 flex-col overflow-hidden',
      header: 'bg-elevated flex items-center py-2',
      body: 'py-0 sm:py-2 flex-1 flex flex-col min-h-0 overflow-hidden',
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
          :loading="isBusy"
          :disabled="imageStore.isGenerating"
          @click="runGenerate"
        />
      </div>
    </template>

    <template #default>
      <!-- 上方：提示词区，自定义为输入框，头像/插图展示模型流式输出与最终提示词 -->
      <div class="border-default shrink-0 border-b p-3 sm:p-4">
        <template v-if="tab === 'generate'">
          <div class="text-muted mb-2 flex items-center gap-1.5 text-xs font-semibold">
            <UIcon name="i-lucide-file-text" class="size-3.5" />
            图像提示词
          </div>
          <UTextarea
            v-model="imageStore.prompt"
            size="lg"
            :rows="3"
            placeholder="描述你想要生成的图片，例如：一只戴帽子的猫在月光下弹钢琴"
            class="w-full"
          />
        </template>
        <template v-else>
          <div class="mb-2 flex items-center gap-2">
            <span class="text-muted flex items-center gap-1.5 text-xs font-semibold">
              <UIcon name="i-lucide-file-text" class="size-3.5" />
              生成提示词
            </span>
            <UBadge v-if="isPromptStage" color="info" variant="subtle" size="xs">
              <UIcon name="i-lucide-loader-circle" class="mr-1 size-3 animate-spin" />
              生成中
            </UBadge>
            <UBadge v-else-if="hasPrompt" color="success" variant="subtle" size="xs">已就绪</UBadge>
            <div v-if="hasPrompt" class="ms-auto flex items-center">
              <UTooltip text="复制提示词">
                <ButtonClipboard :text="promptText" />
              </UTooltip>
            </div>
          </div>
          <div
            ref="promptBox"
            class="bg-elevated/50 border-default max-h-40 min-h-16 overflow-y-auto rounded-lg border p-3"
          >
            <p
              v-if="hasPrompt"
              v-text="promptText"
              class="text-highlighted text-xs leading-relaxed wrap-break-word whitespace-pre-wrap"
              :class="{ 'prompt-streaming': isPromptStage }"
            />
            <div v-else class="text-muted flex h-10 items-center justify-center gap-2 text-xs">
              <UIcon v-if="isPromptStage" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              <span>{{ isPromptStage ? '正在接收模型输出…' : '尚未生成提示词' }}</span>
            </div>
          </div>
        </template>
      </div>

      <!-- 下方：图片结果，生成期间以动画占位提示 -->
      <div class="relative min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
        <div
          v-if="isBusy && currentImages.length"
          class="bg-default/70 absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 backdrop-blur-sm"
        >
          <UIcon name="i-lucide-loader-circle" class="text-primary size-8 animate-spin" />
          <span class="text-muted text-xs font-medium">
            {{ isPromptStage ? '正在构思提示词…' : `正在重新生成${tabMeta.label}…` }}
          </span>
        </div>
        <div
          v-if="isBusy && !currentImages.length"
          class="flex h-full min-h-56 flex-col items-center justify-center gap-4"
        >
          <div
            class="border-default bg-elevated/60 relative flex aspect-square w-44 items-center justify-center overflow-hidden rounded-xl border sm:w-52"
          >
            <USkeleton class="absolute inset-0 rounded-xl" />
            <div class="relative flex flex-col items-center gap-2 px-3 text-center">
              <UIcon name="i-lucide-loader-circle" class="text-primary size-8 animate-spin" />
              <span class="text-muted text-xs font-medium">
                {{ isPromptStage ? '正在构思提示词…' : `正在生成${tabMeta.label}…` }}
              </span>
            </div>
          </div>
          <p class="text-muted text-xs">
            {{ isPromptStage ? '提示词完成后将开始绘制图像' : '图片生成中，请稍候' }}
          </p>
        </div>
        <div v-else-if="imageStore.error" class="flex items-center justify-center p-8">
          <p class="text-error text-sm">{{ imageStore.error }}</p>
        </div>
        <div v-else-if="currentImages.length">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div
              v-for="(img, i) in currentImages"
              :key="i"
              class="border-default flex flex-col overflow-hidden rounded-lg border"
            >
              <img :src="img.url" :alt="`${tabMeta.label} ${i + 1}`" class="w-full object-cover" />
              <!-- 头像的最终提示词已在上方展示；多图任务逐张保留各自提示词 -->
              <div v-if="tab !== 'face'" class="border-default bg-elevated/50 border-t p-3">
                <div class="mb-1.5 flex items-center justify-between gap-2">
                  <span class="text-muted flex items-center gap-1 text-xs font-semibold">
                    <UIcon name="i-lucide-file-text" class="size-3.5" />
                    生成提示词
                  </span>
                  <UTooltip v-if="img.prompt" text="复制提示词">
                    <ButtonClipboard :text="img.prompt" />
                  </UTooltip>
                </div>
                <p
                  v-if="img.prompt"
                  v-text="img.prompt"
                  class="text-muted max-h-28 overflow-y-auto text-xs leading-relaxed wrap-break-word whitespace-pre-wrap"
                />
                <p v-else class="text-muted text-xs">暂无提示词记录，重新生成后即可查看</p>
              </div>
            </div>
            <div
              v-for="n in remainingImages"
              :key="`sk-${n}`"
              class="border-default relative flex min-h-48 items-center justify-center overflow-hidden rounded-lg border"
            >
              <USkeleton class="absolute inset-0" />
              <div class="text-muted relative flex flex-col items-center gap-2 text-xs">
                <UIcon name="i-lucide-loader-circle" class="text-primary size-6 animate-spin" />
                <span>图片生成中…</span>
              </div>
            </div>
          </div>
          <p v-if="isImageStage" class="text-muted mt-3 text-center text-xs">正在生成更多图片…</p>
        </div>
        <div v-else class="flex h-full min-h-40 flex-col items-center justify-center gap-3 px-4 text-center">
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

const imageStore = useImageStore()

type ImageTab = 'face' | 'illustration' | 'generate'

const tabConfig: Record<ImageTab, { label: string; action: string; icon: string; empty: string }> = {
  face: {
    label: '患者头像',
    action: '生成患者头像',
    icon: 'i-lucide-user',
    empty: '尚未生成头像',
  },
  illustration: {
    label: '故事插图',
    action: '生成故事插图',
    icon: 'i-lucide-book-image',
    empty: '尚未生成插图',
  },
  generate: {
    label: '自定义生成',
    action: '生成图像',
    icon: 'i-lucide-pencil',
    empty: '尚未生成图片',
  },
}

const tabMeta = computed(() => tabConfig[props.tab as ImageTab] ?? tabConfig.face)

const isBusy = computed(() => imageStore.isGenerating && imageStore.currentTask === props.tab)
const isPromptStage = computed(() => isBusy.value && imageStore.currentPhase === 'prompt')
const isImageStage = computed(() => isBusy.value && imageStore.currentPhase === 'image')

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
  const task =
    props.tab === 'face'
      ? imageStore.face()
      : props.tab === 'illustration'
        ? imageStore.illustration()
        : imageStore.generate()
  task.catch(() => {})
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

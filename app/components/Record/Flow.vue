<template>
  <section
    class="border-default bg-elevated/40 w-full max-w-full min-w-0 shrink-0 overflow-x-clip rounded-xl border px-3 py-2.5 shadow-sm"
  >
    <div class="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <div class="flex min-w-0 items-center gap-2">
        <UIcon name="i-lucide-workflow" class="text-primary size-4" />
        <h2 class="text-highlighted text-xs font-semibold tracking-wide">{{ t('flow.title') }}</h2>
        <span class="text-muted text-[11px] sm:hidden">{{ t('flow.hintMobile') }}</span>
        <span class="text-muted hidden text-[11px] sm:inline">{{ t('flow.hintDesktop') }}</span>
      </div>
      <div class="ms-auto flex flex-wrap items-center justify-end gap-2">
        <span v-if="staleCount" class="text-warning flex items-center gap-1 text-[11px]">
          <UIcon name="i-lucide-triangle-alert" class="size-3.5" />
          {{ t('flow.stale', { count: staleCount }) }}
        </span>
        <UButton
          icon="i-lucide-rotate-ccw"
          :label="t('flow.restoreDefault')"
          size="xs"
          variant="ghost"
          color="neutral"
          @click="record.restoreDefaultOrder()"
        />
        <UButton
          icon="i-lucide-trash-2"
          :label="t('flow.clearRecords')"
          size="xs"
          variant="ghost"
          color="error"
          :disabled="isGenerating"
          @click="isResetOpen = true"
        />
      </div>
    </div>

    <VueDraggable
      v-model="draggableOrder"
      :animation="180"
      ghost-class="opacity-40"
      class="flex w-full min-w-0 flex-wrap items-center gap-1.5"
    >
      <div v-for="(node, i) in record.nodes" :key="node.key" class="min-w-0 grow basis-36 sm:grow-0 sm:basis-44">
        <UTooltip :text="t('flow.tooltip', { hint: nodeHint(node) })">
          <NuxtLink
            :to="localePath(node.to)"
            :aria-label="t('flow.enterNode', { label: stepLabels[node.key] })"
            class="group flex w-full min-w-0 cursor-pointer items-center gap-1 rounded-lg border px-1.5 py-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm sm:gap-1.5 sm:px-2"
            :class="nodeClass(node)"
          >
            <UIcon
              name="i-lucide-grip-vertical"
              class="text-muted hidden size-3 shrink-0 cursor-grab active:cursor-grabbing sm:block"
            />
            <span class="text-muted shrink-0 font-mono text-[10px] tabular-nums">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <UIcon :name="node.icon" class="size-3.5 shrink-0" />
            <span class="min-w-0 flex-1 truncate text-xs font-medium">{{ stepLabels[node.key] }}</span>
            <span class="size-1.5 shrink-0 rounded-full" :class="dotClass(node)" />
            <UIcon v-if="node.needsRegenerate" name="i-lucide-refresh-cw" class="text-warning size-3 shrink-0" />
            <UIcon
              name="i-lucide-arrow-up-right"
              class="text-muted group-hover:text-primary size-3.5 shrink-0 transition-colors"
            />
          </NuxtLink>
        </UTooltip>
      </div>
    </VueDraggable>
  </section>

  <UModal
    v-model:open="isResetOpen"
    :title="t('flow.clearTitle')"
    :description="t('flow.clearDescription')"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer="{ close }">
      <UButton :label="t('common.cancel')" color="neutral" variant="ghost" @click="close" />
      <UButton :label="t('flow.confirmClear')" icon="i-lucide-trash-2" color="error" @click="handleReset" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { RecordFlowNode, RecordStepKey } from '~/types/record'

const { t } = useI18n()
const localePath = useLocalePath()

const record = useRecordStore()
const route = useRoute()

// 节点文案来自共享的步骤元数据（中文），仅在显示层按当前语言映射
const stepLabels = computed<Record<RecordStepKey, string>>(() => ({
  case: t('sidebar.generateCase'),
  story: t('sidebar.writeStory'),
  test: t('sidebar.testTheory'),
  act: t('sidebar.interactivePractice'),
  rate: t('sidebar.evaluateAbility'),
  image: t('sidebar.imageCreation'),
  video: t('sidebar.videoRendering'),
  audio: t('sidebar.audioSynthesis'),
}))

const stepDescriptions = computed<Record<RecordStepKey, string>>(() => ({
  case: t('flow.descCase'),
  story: t('flow.descStory'),
  test: t('flow.descTest'),
  act: t('flow.descAct'),
  rate: t('flow.descRate'),
  image: t('flow.descImage'),
  video: t('flow.descVideo'),
  audio: t('flow.descAudio'),
}))

// 拖拽结果写回全局顺序；store 内部校验八项完整后才接受
const draggableOrder = computed({
  get: () => [...record.order],
  set: (next: RecordStepKey[]) => record.setOrder(next),
})

const staleCount = computed(() => record.nodes.filter((node) => node.needsRegenerate).length)

// 生成中禁止清空，避免流式结果在清空后继续写回
const isGenerating = computed(() => record.nodes.some((node) => node.isGenerating))
const isResetOpen = ref(false)

function handleReset() {
  record.reset({ clearInputs: true })
  isResetOpen.value = false
}

function nodeClass(node: RecordFlowNode): string {
  const classes: string[] = []
  if (node.needsRegenerate) classes.push('border-warning/60 bg-warning/10')
  else if (node.isGenerating) classes.push('border-info/50 bg-info/5')
  else if (node.hasContent) classes.push('border-success/40 bg-success/5')
  else classes.push('border-default bg-default')
  if (route.path === localePath(node.to)) classes.push('ring-2 ring-primary/40 shadow-sm')
  return classes.join(' ')
}

function dotClass(node: RecordFlowNode): string {
  if (node.needsRegenerate) return 'bg-warning'
  if (node.isGenerating) return 'bg-info animate-pulse'
  if (node.hasContent) return 'bg-success'
  return 'bg-accented'
}

function nodeHint(node: RecordFlowNode): string {
  const label = stepLabels.value[node.key]
  if (node.needsRegenerate) return t('flow.hintStale', { label })
  if (node.isGenerating) return t('flow.hintGenerating', { label })
  if (node.hasContent) return t('flow.hintDone', { label, description: stepDescriptions.value[node.key] })
  return t('flow.hintEmpty', { label })
}
</script>

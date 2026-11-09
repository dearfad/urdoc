<template>
  <section class="px-6 py-8 lg:px-8">
    <UCard variant="subtle" :ui="{ body: 'p-5 sm:p-6' }">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
        <!-- 完成进度 -->
        <div class="lg:w-64 lg:shrink-0">
          <h2 class="text-highlighted flex items-center gap-2 text-lg font-semibold">
            <UIcon name="i-lucide-layout-dashboard" class="text-primary size-5" />
            {{ t('dashboard.workspace.title') }}
          </h2>
          <p class="text-muted mt-1 text-sm">{{ t('dashboard.workspace.subtitle') }}</p>

          <div class="border-default bg-elevated/40 mt-5 rounded-xl border p-4">
            <div class="flex items-baseline justify-between gap-2">
              <span class="text-muted text-xs">{{ t('dashboard.workspace.progress') }}</span>
              <span class="text-highlighted font-mono text-2xl font-semibold">{{ percent }}%</span>
            </div>
            <UProgress :model-value="percent" size="md" color="primary" class="mt-3" />
            <p class="text-muted mt-2.5 text-xs">
              {{ t('dashboard.workspace.progressHint', { done: doneCount, total: nodes.length }) }}
            </p>
            <UButton
              :label="t('dashboard.workspace.continue')"
              :to="localePath(continueTo)"
              icon="i-lucide-arrow-right"
              trailing
              size="lg"
              block
              class="mt-4"
            />
          </div>
          <p class="text-muted mt-3 flex items-center gap-1.5 text-[11px]">
            <UIcon name="i-lucide-hard-drive" class="size-3.5" />
            {{ t('dashboard.workspace.localOnly') }}
          </p>
        </div>

        <!-- 八个环节的状态 -->
        <div class="min-w-0 flex-1">
          <h3 class="text-highlighted mb-3 text-sm font-semibold">{{ t('dashboard.workspace.nodeList') }}</h3>
          <div class="grid gap-2 sm:grid-cols-2">
            <NuxtLink
              v-for="node in nodes"
              :key="node.key"
              :to="localePath(node.to)"
              class="group border-default bg-elevated/30 hover:border-primary/40 hover:bg-elevated flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all"
            >
              <UIcon :name="node.icon" class="text-primary size-4 shrink-0" />
              <span class="text-default min-w-0 flex-1 truncate text-sm">{{ stepLabel(node) }}</span>
              <UBadge :color="statusColor(node)" variant="soft" size="xs">{{ statusLabel(node) }}</UBadge>
            </NuxtLink>
          </div>
          <p v-if="!doneCount" class="text-muted mt-3 flex items-center gap-1.5 text-xs">
            <UIcon name="i-lucide-sparkles" class="size-3.5" />
            {{ t('dashboard.workspace.emptyHint') }}
          </p>
        </div>
      </div>
    </UCard>
  </section>
</template>

<script setup lang="ts">
import type { RecordFlowNode, RecordStepKey } from '~/types/record'

const { t } = useI18n()
const localePath = useLocalePath()
const recordStore = useRecordStore()

// 共享元数据里的环节名称是中文，这里按节点 key 复用已有的中英 sidebar 文案
const STEP_LABEL_KEYS: Record<RecordStepKey, string> = {
  case: 'sidebar.generateCase',
  story: 'sidebar.writeStory',
  test: 'sidebar.testTheory',
  act: 'sidebar.interactivePractice',
  rate: 'sidebar.evaluateAbility',
  image: 'sidebar.imageCreation',
  video: 'sidebar.videoRendering',
  audio: 'sidebar.audioSynthesis',
}

function stepLabel(node: RecordFlowNode): string {
  return t(STEP_LABEL_KEYS[node.key])
}

const nodes = computed<RecordFlowNode[]>(() => recordStore.nodes)
const doneCount = computed(() => nodes.value.filter((node) => node.hasContent).length)
const percent = computed(() => (nodes.value.length ? Math.round((doneCount.value / nodes.value.length) * 100) : 0))
const continueTo = computed(() => nodes.value.find((node) => !node.hasContent)?.to ?? nodes.value[0]?.to ?? '/dashboard')

type NodeState = 'generating' | 'regenerate' | 'done' | 'empty'
type BadgeColor = 'info' | 'warning' | 'success' | 'neutral'

function nodeState(node: RecordFlowNode): NodeState {
  if (node.isGenerating) return 'generating'
  if (node.needsRegenerate) return 'regenerate'
  if (node.hasContent) return 'done'
  return 'empty'
}

function statusColor(node: RecordFlowNode): BadgeColor {
  return { generating: 'info', regenerate: 'warning', done: 'success', empty: 'neutral' }[nodeState(node)]
}

function statusLabel(node: RecordFlowNode): string {
  const keys: Record<NodeState, string> = {
    generating: 'dashboard.workspace.statusGenerating',
    regenerate: 'dashboard.workspace.statusRegenerate',
    done: 'dashboard.workspace.statusDone',
    empty: 'dashboard.workspace.statusEmpty',
  }
  return t(keys[nodeState(node)])
}
</script>

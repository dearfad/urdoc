<template>
  <section class="px-6 py-8 pb-12 lg:px-8">
    <h2 class="text-highlighted flex items-center gap-2 text-lg font-semibold">
      <UIcon name="i-lucide-server-cog" class="text-primary size-5" />
      {{ t('dashboard.service.title') }}
    </h2>
    <p class="text-muted mt-1 text-sm">{{ t('dashboard.service.subtitle') }}</p>

    <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <UCard
        v-for="task in tasks"
        :key="task.key"
        variant="subtle"
        :ui="{ body: 'p-4', root: 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md' }"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="text-highlighted text-sm font-medium">{{ task.label }}</span>
          <span class="size-2 shrink-0 rounded-full" :class="dotClass(task.state)" />
        </div>

        <p class="text-muted mt-4 text-[11px] tracking-wider uppercase">{{ t('dashboard.service.model') }}</p>
        <p class="text-default mt-0.5 truncate font-mono text-sm" :title="task.name">{{ task.name }}</p>
        <p class="text-muted mt-1 truncate text-xs">{{ task.provider }}</p>

        <div class="border-default mt-4 border-t pt-3">
          <USkeleton v-if="task.state === 'unknown' && !error" class="h-5 w-24 rounded-md" />
          <UBadge v-else :color="badgeColor(task.state)" variant="soft" size="xs">
            {{ stateLabel(task.state) }}
          </UBadge>
        </div>
      </UCard>
    </div>

    <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-muted flex items-center gap-1.5 text-xs">
        <UIcon :name="error ? 'i-lucide-triangle-alert' : 'i-lucide-shield-check'" class="size-3.5" />
        {{ error ? t('dashboard.service.statusFailed') : t('dashboard.service.hint') }}
      </p>
      <UButton
        :label="t('dashboard.service.goSettings')"
        :to="localePath('/settings')"
        icon="i-lucide-settings-2"
        color="neutral"
        variant="soft"
        size="lg"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ServiceStatus } from '~/types/github'

const { t } = useI18n()
const localePath = useLocalePath()
const modelStore = useModelStore()

const { data: status, error } = useFetch<ServiceStatus>('/api/status', {
  key: 'service-status',
  server: false,
  lazy: true,
  default: () => null,
})

const TASK_KEYS = ['chat', 'image', 'audio', 'video'] as const
type TaskState = 'ready' | 'missing' | 'custom' | 'unknown'
type BadgeColor = 'success' | 'error' | 'info' | 'neutral'

const tasks = computed(() =>
  TASK_KEYS.map((key) => {
    const model = modelStore.activeModels[key]
    const keyName = model?.apiKey
    const isCustom = !keyName || model?.provider === 'Custom'
    const configured = keyName ? status.value?.configured?.[keyName] : undefined

    let state: TaskState = 'unknown'
    if (isCustom) state = 'custom'
    else if (configured === true) state = 'ready'
    else if (configured === false) state = 'missing'

    return {
      key,
      label: t(`dashboard.service.${key}`),
      provider: model?.provider || '--',
      name: model?.name || '--',
      state,
    }
  }),
)

function dotClass(state: TaskState): string {
  return { ready: 'bg-success', missing: 'bg-error', custom: 'bg-info', unknown: 'bg-neutral' }[state]
}

function badgeColor(state: TaskState): BadgeColor {
  return { ready: 'success', missing: 'error', custom: 'info', unknown: 'neutral' }[state]
}

function stateLabel(state: TaskState): string {
  const keys: Record<TaskState, string> = {
    ready: 'dashboard.service.ready',
    missing: 'dashboard.service.missing',
    custom: 'dashboard.service.custom',
    unknown: 'dashboard.service.statusFailed',
  }
  return t(keys[state])
}
</script>

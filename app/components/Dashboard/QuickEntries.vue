<template>
  <section class="px-6 py-8 lg:px-8">
    <h2 class="text-highlighted flex items-center gap-2 text-lg font-semibold">
      <UIcon name="i-lucide-rocket" class="text-primary size-5" />
      {{ t('dashboard.quick.title') }}
    </h2>
    <p class="text-muted mt-1 text-sm">{{ t('dashboard.quick.subtitle') }}</p>

    <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink
        v-for="item in entries"
        :key="item.to"
        :to="item.to"
        class="group border-default bg-elevated/30 hover:border-primary/40 hover:bg-elevated relative flex items-center gap-3 overflow-hidden rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <span
          class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        />
        <span class="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
          <UIcon :name="item.icon" class="size-4.5" />
        </span>
        <div class="min-w-0">
          <p class="text-highlighted truncate text-sm font-medium">{{ item.label }}</p>
          <p class="text-muted truncate text-xs">{{ item.description }}</p>
        </div>
        <UIcon
          name="i-lucide-arrow-up-right"
          class="text-muted ml-auto size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        />
      </NuxtLink>
    </div>

    <!-- 推荐流程 -->
    <div class="border-default bg-elevated/30 mt-4 rounded-xl border p-4">
      <p class="text-muted mb-3 text-[11px] tracking-wider uppercase">{{ t('dashboard.quick.workflow') }}</p>
      <div class="flex flex-wrap items-center gap-2">
        <template v-for="(step, index) in workflowSteps" :key="step">
          <UBadge :color="index === workflowSteps.length - 1 ? 'primary' : 'neutral'" variant="soft" size="md" class="px-3 py-1.5">
            {{ index + 1 }}. {{ step }}
          </UBadge>
          <UIcon v-if="index < workflowSteps.length - 1" name="i-lucide-arrow-right" class="text-muted size-3.5" />
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const entries = computed(() => [
  { label: t('sidebar.generateCase'), icon: 'i-lucide-file-text', description: t('dashboard.caseDesc'), to: localePath('/cstar/case') },
  { label: t('sidebar.writeStory'), icon: 'i-lucide-book-open', description: t('dashboard.storyDesc'), to: localePath('/cstar/story') },
  { label: t('sidebar.testTheory'), icon: 'i-lucide-clipboard-check', description: t('dashboard.testDesc'), to: localePath('/cstar/test') },
  { label: t('sidebar.interactivePractice'), icon: 'i-lucide-message-square', description: t('dashboard.actDesc'), to: localePath('/cstar/act') },
  { label: t('sidebar.evaluateAbility'), icon: 'i-lucide-bar-chart-3', description: t('dashboard.rateDesc'), to: localePath('/cstar/rate') },
  { label: t('sidebar.imageCreation'), icon: 'i-lucide-image', description: t('dashboard.imageDesc'), to: localePath('/multimodal/image') },
  { label: t('sidebar.videoRendering'), icon: 'i-lucide-video', description: t('dashboard.videoDesc'), to: localePath('/multimodal/video') },
  { label: t('sidebar.audioSynthesis'), icon: 'i-lucide-volume-2', description: t('dashboard.audioDesc'), to: localePath('/multimodal/audio') },
])

const workflowSteps = computed(() => [
  t('sidebar.generateCase'),
  t('sidebar.writeStory'),
  t('sidebar.testTheory'),
  t('sidebar.interactivePractice'),
  t('sidebar.evaluateAbility'),
])
</script>

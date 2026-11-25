<template>
  <section v-if="titleKey" class="mb-6">
    <h2 class="text-highlighted flex items-center gap-2 text-lg font-semibold">
      <UIcon :name="icon" class="text-primary size-5" />
      {{ t(titleKey) }}
    </h2>
    <p v-if="descriptionKey" class="text-muted mt-1 text-sm">{{ t(descriptionKey) }}</p>
  </section>

  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <NuxtLink
      v-for="item in items"
      :key="item.slug"
      :to="localePath(item.path)"
      class="group cursor-pointer focus-visible:ring-primary rounded-xl focus-visible:ring-2 focus-visible:outline-none"
    >
      <UCard
        variant="subtle"
        :ui="{ root: 'h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md', body: 'p-5' }"
        class="hover:border-primary/40 group-hover:border-primary/40"
      >
        <div class="flex items-start gap-4">
          <span class="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
            <UIcon :name="item.icon" class="size-5" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-highlighted truncate text-base font-semibold">{{ t(item.labelKey) }}</h3>
              <UBadge v-if="item.badgeKey" :color="badgeColor(item.badgeKey)" variant="subtle" size="xs" class="shrink-0">
                {{ t(item.badgeKey) }}
              </UBadge>
            </div>
            <p class="text-muted mt-1.5 line-clamp-3 text-sm leading-relaxed">{{ t(item.descriptionKey) }}</p>
          </div>
        </div>

        <div class="border-default mt-5 flex items-center justify-between border-t pt-3">
          <span class="text-primary text-xs font-medium">{{ t('projectPage.common.enter') }}</span>
          <UIcon
            name="i-lucide-arrow-up-right"
            class="text-muted group-hover:text-primary size-4 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        </div>
      </UCard>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { ProjectEntry } from '~/utils/project'

withDefaults(
  defineProps<{
    items: ProjectEntry[]
    titleKey?: string
    descriptionKey?: string
    icon?: string
  }>(),
  { icon: 'i-lucide-layout-grid' }
)

const { t } = useI18n()
const localePath = useLocalePath()

function badgeColor(key: string): 'success' | 'neutral' {
  return key.includes('available') ? 'success' : 'neutral'
}
</script>

<template>
  <UCard
    :ui="{
      root: 'nm-card-root relative overflow-hidden border-0',
      header: 'nm-card-head relative border-b px-5 py-4 sm:px-6',
      body: 'nm-card-body relative flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6',
    }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="nm-icon relative flex h-9 w-9 items-center justify-center rounded-lg">
          <UIcon :name="meta.icon" class="text-lg text-white" />
          <div
            class="absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
        <div class="flex flex-col">
          <h2 class="nm-block-title text-lg font-bold sm:text-xl">{{ meta.label }}</h2>
          <p class="nm-block-sub text-xs sm:text-sm">{{ meta.hint }}</p>
        </div>
        <UBadge variant="subtle" size="sm" class="nm-badge ms-auto hidden sm:flex">{{ meta.badge }}</UBadge>
      </div>
    </template>
    <slot />
  </UCard>
</template>

<script setup lang="ts">
import type { NarrativeBlockMeta } from '~/utils/narrativeSections'

defineProps<{ meta: NarrativeBlockMeta }>()
</script>

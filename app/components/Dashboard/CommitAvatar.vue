<template>
  <span
    class="bg-elevated ring-default relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1"
    :class="sizeClass"
  >
    <img
      v-if="showImage"
      :src="author?.avatarUrl ?? ''"
      :alt="author?.name ?? ''"
      class="size-full object-cover"
      loading="lazy"
      @error="failed = true"
    />
    <span v-else class="text-muted font-semibold" :class="textClass">{{ initial }}</span>
  </span>
</template>

<script setup lang="ts">
import type { CommitAuthor } from '~/types/github'

const props = withDefaults(
  defineProps<{
    author?: CommitAuthor | null
    size?: 'xs' | 'sm' | 'md'
  }>(),
  { author: null, size: 'sm' },
)

const failed = ref(false)
const showImage = computed(() => Boolean(props.author?.avatarUrl) && !failed.value)
const initial = computed(() => (props.author?.name || '?').slice(0, 1).toUpperCase())
const sizeClass = computed(() => ({ xs: 'size-6', sm: 'size-8', md: 'size-9' })[props.size])
const textClass = computed(() => ({ xs: 'text-[10px]', sm: 'text-xs', md: 'text-sm' })[props.size])

// 头像地址变化时重新尝试加载，避免沿用上一位作者的失败状态
watch(
  () => props.author?.avatarUrl,
  () => {
    failed.value = false
  },
)
</script>

<template>
  <UPageHero
    title="虚拟病例研究平台"
    description="通过大语言模型生成病例、编写故事、设计问题、模拟问诊、评估能力，CSTAR模式的应用与创新实践"
    :links="links"
    headline="URDOC 🌱 CSTAR"
  />
</template>

<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

definePageMeta({
  layout: 'landing',
})

const links = ref<ButtonProps[]>([
  {
    label: '开始',
    to: '/dashboard',
    icon: 'i-lucide-square-play',
  },
  {
    label: '文档',
    to: 'https://docs.urdoc.dearfad.com',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: 'i-lucide-arrow-right',
  },
])
</script>

<template>
  <div>
    <UPageHero title="URDOC" description="虚拟病例研究平台，CSTAR模式的应用与创新实践" :links="links" />
    <UPageSection> </UPageSection>
  </div>
</template>

<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
const links = ref<ButtonProps[]>([
  {
    label: '开始',
    to: '/',
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

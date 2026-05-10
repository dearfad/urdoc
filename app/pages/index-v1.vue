<template>
  <UPage>
    <!-- Hero -->
    <UPageHero
      headline="URDOC · CSTAR"
      description="基于大语言模型的医学教育创新平台 —— 从病例生成到能力评估，AI 驱动的 CSTAR 全流程闭环"
      :links="heroLinks"
    >
      <template #title>
        <span
          class="
            bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500
            bg-clip-text text-transparent
            text-5xl/snug sm:text-6xl/snug lg:text-7xl/snug
            font-bold tracking-tight
          "
        >
          虚拟病例研究平台
        </span>
      </template>
    </UPageHero>

    <!-- CSTAR 核心模块 -->
    <UPageSection
      id="modules"
      headline="CSTAR 核心模块"
      title="覆盖医学教育全场景"
      description="五大模块环环相扣，从病例生成到能力评估构建完整的教学闭环"
    >
      <UPageGrid>
        <UPageCard
          v-for="mod in modules"
          :key="mod.title"
          v-bind="mod"
        />
      </UPageGrid>
    </UPageSection>

    <!-- 平台优势 -->
    <UPageSection
      id="advantages"
      headline="平台优势"
      title="为什么选择 URDOC"
      description="专业、高效、智能，为医学教育量身打造"
    >
      <UPageGrid>
        <UPageCard
          v-for="adv in advantages"
          :key="adv.title"
          v-bind="adv"
        />
      </UPageGrid>
    </UPageSection>

    <!-- CTA -->
    <UPageCTA
      title="开启 AI 辅助医学教学之旅"
      description="无需配置，立即体验智能病例生成与教学评估"
      :links="ctaLinks"
    />
  </UPage>
</template>

<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

definePageMeta({
  layout: 'landing',
})

const heroLinks = [
  { label: '开始使用', to: '/dashboard', icon: 'i-lucide-square-play', size: 'lg' },
  { label: '查阅文档', to: 'https://docs.urdoc.dearfad.com', color: 'neutral' as const, variant: 'subtle' as const, trailingIcon: 'i-lucide-arrow-right', size: 'lg' },
] satisfies ButtonProps[]

const modules = [
  {
    icon: 'i-lucide-notebook-pen',
    title: '生成病例',
    description: 'AI 根据教学需求自动生成结构化病例，包含主诉、现病史、诊断等完整信息',
    to: '/cstar/case',
  },
  {
    icon: 'i-lucide-book-open',
    title: '编写故事',
    description: '将病例转化为叙事医学故事，增强人文关怀与临床思维的融合训练',
    to: '/cstar/story',
  },
  {
    icon: 'i-lucide-clipboard-check',
    title: '考核理论',
    description: '基于病例生成考核题目，检验学习者对理论知识的掌握程度',
    to: '/cstar/test',
  },
  {
    icon: 'i-lucide-message-square',
    title: '互动实践',
    description: '模拟真实问诊场景，与 AI 患者进行对话式临床实践训练',
    to: '/cstar/act',
  },
  {
    icon: 'i-lucide-bar-chart-3',
    title: '评估能力',
    description: '多维度评估临床能力，生成个性化学习建议与能力分析报告',
    to: '/cstar/rate',
  },
]

const advantages = [
  {
    icon: 'i-lucide-sparkles',
    title: 'AI 驱动',
    description: '基于大语言模型，智能生成病例、故事与考核内容，大幅提升教学效率',
  },
  {
    icon: 'i-lucide-target',
    title: '标准评估',
    description: '多维度能力评估体系，客观量化学习效果，提供个性化改进建议',
  },
  {
    icon: 'i-lucide-workflow',
    title: '全流程覆盖',
    description: '从病例生成到能力评估，CSTAR 五模块构建完整的医学教学闭环',
  },
]

const ctaLinks = [
  { label: '开始使用', to: '/dashboard', color: 'primary', icon: 'i-lucide-square-play' },
  { label: '了解更多', to: 'https://docs.urdoc.dearfad.com', color: 'neutral', variant: 'subtle', trailingIcon: 'i-lucide-arrow-right' },
] satisfies ButtonProps[]
</script>

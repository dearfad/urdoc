<template>
  <!-- 唯一的结构骨架：模板切换只改变根节点上的 data-nm-template 属性。
       属性必须挂在 #nm-sheet 本身，ButtonCapture 克隆子树时才会保留模板变量。 -->
  <article
    id="nm-sheet"
    class="nm-sheet relative mx-auto flex w-full max-w-4xl flex-col"
    :data-nm-template="templateId"
    aria-label="叙事医学界面"
  >
    <!-- 顶部装饰光晕 -->
    <div
      class="nm-decor nm-decor-1 pointer-events-none absolute -top-24 left-1/2 h-48 w-[80%] -translate-x-1/2 rounded-full blur-3xl"
    />
    <div class="nm-decor nm-decor-2 pointer-events-none absolute top-40 -right-16 h-32 w-32 rounded-full blur-3xl" />
    <div class="nm-decor nm-decor-3 pointer-events-none absolute bottom-32 -left-20 h-40 w-40 rounded-full blur-3xl" />

    <!-- 页面内容 -->
    <div
      class="relative z-10 flex flex-1 flex-col gap-6 px-4 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 lg:px-12 lg:py-12"
    >
      <!-- 刊头：左专题大字 + 右刊名小字，模板可整体重排 -->
      <header class="nm-sheet-head flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="nm-sheet-title flex flex-col gap-2">
          <p class="nm-sheet-kicker">NARRATIVE MEDICINE / 003</p>
          <p v-if="data.diseaseName" class="nm-title text-2xl sm:text-3xl md:text-4xl">
            {{ data.diseaseName }}
          </p>
        </div>
        <div class="nm-nameplate-box flex flex-col items-center gap-1.5 text-center">
          <span class="nm-nameplate-line h-px w-24 sm:w-32" />
          <h1 class="nm-nameplate text-lg sm:text-xl">叙事医学</h1>
          <p class="nm-nameplate-sub text-[6px] font-medium uppercase sm:text-[7px]">
            NARRATIVE MEDICINE
          </p>
          <span class="nm-nameplate-line h-px w-24 sm:w-32" />
        </div>
      </header>

      <!-- 区块容器：声明了 layout 的模板按区域分组，其余模板保持线性单列 -->
      <div v-if="layout" class="nm-layout" :data-nm-layout="templateId">
        <div v-for="area in visibleAreas" :key="area.key" class="nm-layout-area" :data-nm-area="area.key">
          <NarrativeSection v-for="block in area.blocks" :key="block.key" :meta="block" :data="data" />
        </div>
      </div>
      <div v-else class="nm-blocks flex flex-col">
        <NarrativeSection v-for="block in blocks" :key="block.key" :meta="block" :data="data" />
      </div>

      <!-- 页脚装饰 -->
      <footer class="nm-sheet-footer mt-2 flex flex-col items-center gap-2 text-center">
        <div class="nm-footer-line h-px w-full max-w-md" />
        <p class="nm-footer-text text-xs tracking-[0.4em] sm:text-sm">叙事医学 · 人文关怀 · 共情实践</p>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { NarrativeSectionKey, NarrativeSheetData } from '~/types/narrative'
import type { NarrativeBlockMeta } from '~/utils/narrativeSections'
import NarrativeSection from './Section.vue'

const props = defineProps<{ templateId: string; data: NarrativeSheetData }>()

// 区块清单是数据契约，与模板无关
const blocks = NARRATIVE_BLOCKS
const blockMap = new Map<NarrativeSectionKey, NarrativeBlockMeta>(
  blocks.map((block): [NarrativeSectionKey, NarrativeBlockMeta] => [block.key, block]),
)

// 布局来自模板注册表的声明；未声明的模板沿用线性单列，不受影响
const layout = computed(() => resolveNarrativeTemplate(props.templateId).layout)

// 整组区块都被隐藏时移除该区域，避免网格留下空洞
const visibleAreas = computed(() =>
  (layout.value?.areas ?? [])
    .filter((area) => area.blocks.some((key) => props.data.show[key]))
    .map((area) => ({
      key: area.key,
      blocks: area.blocks.map((key) => blockMap.get(key)).filter((block): block is NarrativeBlockMeta => !!block),
    })),
)
</script>

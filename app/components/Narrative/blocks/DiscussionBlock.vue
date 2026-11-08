<template>
  <div class="flex flex-col gap-4">
    <template v-if="data.discussionContent">
      <Markdown :value="data.discussionContent" class="nm-md *:first:mt-0 *:last:mb-0" />
    </template>
    <template v-else-if="data.generatingSection === 'story-discussion'">
      <div class="nm-illus-label flex items-center gap-2 text-sm font-medium">
        <UIcon name="i-lucide-loader-circle" class="animate-spin text-base" />
        <span>多方讨论生成中…</span>
      </div>
    </template>
    <template v-else>
      <p class="nm-placeholder leading-relaxed">
        【占位文字】从生物-心理-社会医学模式出发，结合患者叙事探讨疾病的多重意义。既要关注病理生理，也要理解疾病对患者身份、角色、家庭与社会的影响。
      </p>
      <div class="grid gap-3 sm:grid-cols-2">
        <div class="nm-discussion-item relative overflow-hidden rounded-lg p-4">
          <div class="nm-discussion-label mb-2 flex items-center gap-2 text-sm font-medium">
            <UIcon name="i-lucide-heart-handshake" />
            <span>共情视角</span>
          </div>
          <p class="nm-placeholder-muted text-sm leading-relaxed">
            【占位文字】关注“患病体验”本身，理解患者如何赋予疾病意义，尊重其叙述的合理性与价值。
          </p>
        </div>
        <div class="nm-discussion-item relative overflow-hidden rounded-lg p-4">
          <div class="nm-discussion-label mb-2 flex items-center gap-2 text-sm font-medium">
            <UIcon name="i-lucide-network" />
            <span>整体视角</span>
          </div>
          <p class="nm-placeholder-muted text-sm leading-relaxed">
            【占位文字】结合家庭、文化、经济等社会因素，思考支持体系与可行的照护策略，追求整体性关怀。
          </p>
        </div>
      </div>
      <p class="nm-placeholder-muted leading-relaxed">
        【占位文字】在讨论中避免仅以“疾病”概括患者，转而关注“人在患病”这一整体，体现叙事医学的人文关怀与临床思辨的统一。
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { NarrativeSheetData } from '~/types/narrative'

defineProps<{ data: NarrativeSheetData }>()
</script>

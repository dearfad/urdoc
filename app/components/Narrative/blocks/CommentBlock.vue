<template>
  <div class="flex flex-col gap-4">
    <template v-if="data.commentContent">
      <Markdown :value="data.commentContent" class="nm-md *:first:mt-0 *:last:mb-0" />
    </template>
    <template v-else-if="data.generatingSection === 'story-comment'">
      <div class="nm-illus-label flex items-center gap-2 text-sm font-medium">
        <UIcon name="i-lucide-loader-circle" class="animate-spin text-base" />
        <span>专家点评生成中…</span>
      </div>
    </template>
    <template v-else>
      <p class="nm-placeholder leading-relaxed">
        【占位文字】总结本次叙事医学实践的主要收获，提炼医患沟通中的闪光点，反思倾听方式对建立信任、改善理解的作用。
      </p>
      <div class="nm-highlight relative overflow-hidden rounded-lg p-4 sm:p-5">
        <div class="nm-discussion-label mb-2 flex items-center gap-2 text-sm font-medium">
          <UIcon name="i-lucide-sparkles" />
          <span>启发与思考</span>
        </div>
        <ul class="flex flex-col gap-2 text-sm leading-relaxed">
          <li class="nm-placeholder-muted flex items-start gap-2">
            <UIcon name="i-lucide-dot" class="nm-illus-icon mt-1 text-lg" />
            <span>【占位文字】叙事不仅是记录，更是理解疾病体验的重要临床工具。</span>
          </li>
          <li class="nm-placeholder-muted flex items-start gap-2">
            <UIcon name="i-lucide-dot" class="nm-illus-icon mt-1 text-lg" />
            <span>【占位文字】倾听本身就是治疗，在共情中寻找平衡，既要科学理性，也要人文温暖。</span>
          </li>
          <li class="nm-placeholder-muted flex items-start gap-2">
            <UIcon name="i-lucide-dot" class="nm-illus-icon mt-1 text-lg" />
            <span>【占位文字】将患者的生活叙事融入临床思考，有助于制定更贴合实际的照护方案。</span>
          </li>
        </ul>
      </div>
      <p class="nm-placeholder-muted leading-relaxed">
        【占位文字】展望未来：持续练习叙事倾听，将人文关怀贯穿临床实践的每一个环节，在技术与温情之间找到属于自己的平衡点。
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { NarrativeSheetData } from '~/types/narrative'

defineProps<{ data: NarrativeSheetData }>()
</script>

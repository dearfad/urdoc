<template>
  <div class="flex flex-col gap-4">
    <template v-if="data.conversationContent">
      <Markdown :value="data.conversationContent" class="nm-md *:first:mt-0 *:last:mb-0" />
    </template>
    <template v-else-if="data.generatingSection === 'story-conversation'">
      <div class="nm-illus-label flex items-center gap-2 text-sm font-medium">
        <UIcon name="i-lucide-loader-circle" class="animate-spin text-base" />
        <span>医患对话生成中…</span>
      </div>
    </template>
    <template v-else>
      <div class="nm-bubble relative rounded-2xl rounded-tl-md p-4 sm:p-5">
        <div class="nm-bubble-label mb-2 flex items-center gap-2 text-sm font-medium">
          <UIcon name="i-lucide-user" />
          <span>患者</span>
        </div>
        <p class="nm-placeholder leading-relaxed">
          【占位文字】在交流中表达内心顾虑、对诊断的疑问以及对生活的担忧，语言真实自然，体现患者的独特叙述视角。
        </p>
      </div>
      <div class="nm-bubble relative rounded-2xl rounded-tr-md p-4 sm:p-5">
        <div class="nm-bubble-label mb-2 flex items-center justify-end gap-2 text-sm font-medium">
          <span>医师</span>
          <UIcon name="i-lucide-stethoscope" />
        </div>
        <p class="nm-placeholder text-right leading-relaxed">
          【占位文字】以倾听、共情、解释为主的回应方式，关注患者的情感需求，在医学信息传递的同时给予充分的理解与支持。
        </p>
      </div>
      <div class="nm-bubble relative rounded-2xl rounded-tl-md p-4 sm:p-5">
        <div class="nm-bubble-label mb-2 flex items-center gap-2 text-sm font-medium">
          <UIcon name="i-lucide-users" />
          <span>共同讨论</span>
        </div>
        <p class="nm-placeholder leading-relaxed">
          【占位文字】双方在对话中逐步建立信任，共同梳理治疗选择、生活调整与预期目标，体现医患共同决策的叙事过程。
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { NarrativeSheetData } from '~/types/narrative'

defineProps<{ data: NarrativeSheetData }>()
</script>

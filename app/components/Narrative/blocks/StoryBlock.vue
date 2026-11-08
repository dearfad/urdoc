<template>
  <div class="flex flex-col gap-4">
    <template v-if="data.storyContent">
      <Markdown :value="data.storyContent" class="story-md *:first:mt-0 *:last:mb-0" />
    </template>
    <template v-else>
      <p class="nm-placeholder leading-relaxed">
        【占位文字】从患者视角展开叙述，着重呈现其就诊历程中的心路历程、家庭支持、社会环境以及对疾病的认知与感受。通过细腻的语言勾勒出疾病之外的生活图景。
      </p>
      <p class="nm-placeholder-muted leading-relaxed">
        【占位文字】此处将以连贯的段落形式还原患者的叙事线索，突出情感细节与生命经历，为后续对话与讨论提供叙事素材。
      </p>
    </template>
  </div>

  <!-- 关于故事的四格插图 -->
  <div v-if="data.show.illustration" class="flex flex-col gap-3">
    <div class="flex items-center gap-2 text-sm font-medium">
      <UIcon name="i-lucide-layout-grid" class="nm-illus-icon text-lg" />
      <span class="nm-illus-label">插图</span>
      <UBadge v-if="data.isIllustrationGenerating" color="warning" variant="subtle" size="xs" class="ms-1">
        生成中
      </UBadge>
    </div>

    <!-- 尚未生成任何插图：四个占位框 -->
    <div v-if="!data.isIllustrationGenerating && !data.illustrationImages.length" class="grid grid-cols-2 gap-3 sm:gap-4">
      <div
        v-for="index in 4"
        :key="index"
        class="nm-illus nm-illus-empty group relative aspect-4/3 overflow-hidden rounded-lg"
      >
        <div class="absolute inset-px rounded-[7px] bg-white/85 backdrop-blur-[1px]" />
        <div class="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1 text-center">
          <UIcon
            name="i-lucide-image-plus"
            class="nm-illus-icon text-xl transition-transform duration-500 group-hover:scale-110 sm:text-2xl"
          />
          <span class="nm-illus-label px-2 text-[10px] font-medium sm:text-xs">插图 {{ index }} · 占位框</span>
        </div>
        <div class="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/80" />
      </div>
    </div>

    <!-- 已有插图 / 生成中：渐进渲染 -->
    <div v-else class="grid grid-cols-2 gap-3 sm:gap-4">
      <div
        v-for="(img, i) in data.illustrationImages"
        :key="i"
        class="nm-illus border-default relative aspect-4/3 overflow-hidden rounded-lg border"
      >
        <img :src="img.url" :alt="`故事插图 ${i + 1}`" class="h-full w-full object-cover" />
      </div>
      <template v-if="data.isIllustrationGenerating">
        <!-- 正在生成的插图：仅当前这张转圈 -->
        <div
          v-if="data.illustrationImages.length < 4"
          class="nm-illus nm-illus-empty group relative aspect-4/3 overflow-hidden rounded-lg"
        >
          <div class="absolute inset-px rounded-[7px] bg-white/85 backdrop-blur-[1px]" />
          <div class="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1 text-center">
            <UIcon name="i-lucide-loader-circle" class="nm-illus-icon animate-spin text-xl sm:text-2xl" />
            <span class="nm-illus-label px-2 text-[10px] font-medium sm:text-xs">插图生成中…</span>
          </div>
          <div class="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/80" />
        </div>
        <!-- 尚未开始的插图：普通占位框（不转圈） -->
        <div
          v-for="n in data.pendingIllustrations"
          :key="`pending-${n}`"
          class="nm-illus nm-illus-empty group relative aspect-4/3 overflow-hidden rounded-lg"
        >
          <div class="absolute inset-px rounded-[7px] bg-white/85 backdrop-blur-[1px]" />
          <div class="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1 text-center">
            <UIcon
              name="i-lucide-image-plus"
              class="nm-illus-icon text-xl transition-transform duration-500 group-hover:scale-110 sm:text-2xl"
            />
            <span class="nm-illus-label px-2 text-[10px] font-medium sm:text-xs"
              >插图 {{ data.illustrationImages.length + n }} · 待生成</span
            >
          </div>
          <div class="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/80" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NarrativeSheetData } from '~/types/narrative'

defineProps<{ data: NarrativeSheetData }>()
</script>

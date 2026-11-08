<template>
  <div class="flex flex-col gap-4">
    <template v-if="data.hasCase">
      <!-- 头部：左侧文字（约 2/3） + 右侧患者头像（约 1/3） -->
      <div class="flex items-start gap-4">
        <div class="flex min-w-0 flex-1 flex-col gap-3">
          <div v-for="[key, value] in data.caseHeaders" :key="key" class="flex flex-col gap-1">
            <p class="nm-field-label text-sm font-semibold">{{ key }}</p>
            <p class="nm-field-value leading-relaxed whitespace-pre-wrap">{{ value }}</p>
          </div>
        </div>
        <!-- 右侧：患者头像 -->
        <div v-if="data.show.avatar" class="flex w-1/3 shrink-0 justify-center">
          <div class="nm-avatar group relative aspect-square w-full max-w-65 overflow-hidden rounded-full bg-white">
            <img
              :src="data.avatarSrc"
              :alt="`${data.patientName}头像`"
              width="1024"
              height="1024"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="nm-avatar-ring pointer-events-none absolute inset-0 rounded-full" />
            <!-- 头像生成中遮罩 -->
            <Transition name="nm-fade">
              <div
                v-if="data.isAvatarGenerating"
                class="nm-avatar-mask absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-full backdrop-blur-sm"
              >
                <UIcon name="i-lucide-loader-circle" class="animate-spin text-2xl" />
                <span class="text-xs font-medium">头像生成中</span>
              </div>
            </Transition>
          </div>
        </div>
      </div>
      <!-- 其余字段 -->
      <div v-for="[key, value] in data.caseOthers" :key="key" class="flex flex-col gap-1">
        <p class="nm-field-label text-sm font-semibold">{{ key }}</p>
        <p class="nm-field-value leading-relaxed whitespace-pre-wrap">{{ value }}</p>
      </div>
    </template>
    <p v-else class="nm-placeholder-muted leading-relaxed">
      尚未生成病例内容，请在上方输入疾病设定后点击「生成叙事」，或从「病例」模块导入已有病例。
    </p>
  </div>
</template>

<script setup lang="ts">
import type { NarrativeSheetData } from '~/types/narrative'

defineProps<{ data: NarrativeSheetData }>()
</script>

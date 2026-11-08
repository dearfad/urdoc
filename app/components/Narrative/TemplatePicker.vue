<template>
  <!-- 模板选择器位于 #nm-sheet 之外，避免被截入图片 -->
  <UPopover v-model:open="isOpen" :content="{ align: 'end', side: 'bottom', sideOffset: 10 }">
    <UButton size="xl" icon="i-lucide-palette" variant="ghost" class="nm-control-btn shrink-0 rounded-xl border">
      模板
    </UButton>

    <template #content>
      <div
        class="border-default w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl border bg-white/95 p-2 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:w-72"
      >
        <p class="text-muted px-2 py-1.5 text-[11px] font-semibold tracking-wide">显示模板</p>
        <button
          v-for="item in templates"
          :key="item.id"
          type="button"
          class="hover:bg-elevated flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors"
          :aria-pressed="item.id === currentId"
          @click="select(item.id)"
        >
          <span
            class="h-8 w-11 shrink-0 rounded-lg ring-1 ring-black/5"
            :style="{ background: `linear-gradient(135deg, ${item.swatch[0]}, ${item.swatch[1]})` }"
          />
          <span class="flex min-w-0 flex-1 flex-col">
            <span class="truncate text-sm font-semibold text-gray-900">{{ item.label }}</span>
            <span class="text-muted truncate text-[11px]">{{ item.description }}</span>
          </span>
          <UIcon
            v-if="item.id === currentId"
            name="i-lucide-check"
            class="text-primary shrink-0 text-base"
            aria-hidden="true"
          />
        </button>
        <p class="text-muted border-default mt-1 border-t px-2 pt-2 text-[11px] leading-relaxed">
          模板可改变配色、排版与区块布局，内容与截屏结果保持一致；选择会被记住。
        </p>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { NARRATIVE_TEMPLATES, resolveNarrativeTemplate } from '~/utils/narrativeTemplates'

const narrativeStore = useNarrativeStore()
const isOpen = ref(false)
const templates = NARRATIVE_TEMPLATES

// 读取时兜底解析，本地脏值或已下线模板自动回退默认模板
const currentId = computed(() => resolveNarrativeTemplate(narrativeStore.templateId).id)

function select(id: string) {
  narrativeStore.setTemplate(id)
  isOpen.value = false
}
</script>

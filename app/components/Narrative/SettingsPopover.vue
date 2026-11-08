<template>
  <!-- 设定弹窗位于 #nm-sheet 之外，开关只影响生成计划与区块显隐，与显示模板无关 -->
  <UPopover
    :open="props.open"
    :content="{ align: 'end', side: 'bottom', sideOffset: 10 }"
    :ui="{ content: 'bg-transparent shadow-none ring-0 rounded-none' }"
    class="flex shrink-0"
    @update:open="emit('update:open', $event)"
  >
    <UButton
      size="xl"
      icon="i-lucide-settings"
      variant="ghost"
      class="nm-control-btn group shrink-0 justify-center rounded-xl border"
      :ui="{ leadingIcon: 'transition-transform duration-500 group-hover:rotate-90' }"
    >
      设定
    </UButton>

    <template #content>
      <UCard
        :ui="{
          root: 'w-76 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-rose-100/80 bg-white/95 shadow-[0_24px_64px_-24px_rgba(244,114,182,0.55)] ring-1 ring-white/70 backdrop-blur-xl sm:w-84',
          header: 'p-0 sm:p-0',
          body: 'p-0 sm:p-0',
          footer: 'p-0 sm:p-0',
        }"
      >
        <template #header>
          <div class="flex items-center gap-3 bg-linear-to-r from-rose-50/90 via-white to-fuchsia-50/70 px-4 py-3.5">
            <div
              class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-rose-500 to-fuchsia-500 shadow-lg shadow-rose-500/20"
            >
              <UIcon name="i-lucide-settings" class="text-lg text-white" />
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-sm font-bold text-gray-900 sm:text-base">叙事设定</h3>
              <p class="text-[11px] text-rose-500/80">选择需要生成与显示的内容</p>
            </div>
            <UButton
              icon="i-lucide-rotate-ccw"
              variant="ghost"
              size="xs"
              color="neutral"
              title="恢复默认"
              aria-label="恢复默认设定"
              @click="narrativeStore.restoreDefaults()"
            />
          </div>
        </template>

        <!-- 列头：点击可一键切换整列开关 -->
        <div
          class="grid grid-cols-[1fr_3.5rem_3.5rem] items-center gap-1 border-b border-rose-100/70 bg-rose-50/40 px-4 py-2"
        >
          <span class="text-[11px] font-semibold tracking-wide text-gray-500">内容</span>
          <button
            type="button"
            class="rounded-md py-1 text-center text-[11px] font-semibold tracking-wide text-rose-600 transition-colors hover:bg-rose-100/70"
            title="点击切换全部生成项"
            @click="toggleAll('generate')"
          >
            生成
          </button>
          <button
            type="button"
            class="rounded-md py-1 text-center text-[11px] font-semibold tracking-wide text-sky-600 transition-colors hover:bg-sky-100/70"
            title="点击切换全部显示项"
            @click="toggleAll('show')"
          >
            显示
          </button>
        </div>

        <!-- 各区块的生成 / 显示开关 -->
        <div class="max-h-[min(56vh,22rem)] divide-y divide-rose-50 overflow-y-auto px-2 py-1">
          <div
            v-for="item in sections"
            :key="item.key"
            class="grid grid-cols-[1fr_3.5rem_3.5rem] items-center gap-1 rounded-lg px-2 py-2 transition-colors hover:bg-rose-50/60"
          >
            <div class="flex min-w-0 items-center gap-2">
              <UIcon :name="item.icon" class="shrink-0 text-base" :class="item.tone" />
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-gray-800">{{ item.label }}</p>
                <p class="truncate text-[10px]" :class="isBlocked(item) ? 'text-amber-500' : 'text-gray-400'">
                  {{ settingHint(item) }}
                </p>
              </div>
            </div>
            <div class="flex justify-center">
              <USwitch
                :model-value="narrativeStore.generate[item.key]"
                :disabled="isDisabled(item, 'generate')"
                color="error"
                size="lg"
                :aria-label="`生成${item.label}`"
                @update:modelValue="(v) => setFlag('generate', item.key, v)"
              />
            </div>
            <div class="flex justify-center">
              <USwitch
                :model-value="narrativeStore.show[item.key]"
                :disabled="isDisabled(item, 'show')"
                color="error"
                size="lg"
                :aria-label="`显示${item.label}`"
                @update:modelValue="(v) => setFlag('show', item.key, v)"
              />
            </div>
          </div>
        </div>

        <template #footer>
          <div
            class="flex items-start gap-2 border-t border-rose-100/70 bg-rose-50/40 px-4 py-3 text-[11px] leading-relaxed text-gray-500"
          >
            <UIcon name="i-lucide-info" class="mt-0.5 shrink-0 text-sm text-rose-400" />
            <span>默认仅生成并显示病例与故事；生成顺序由各页面顶部的「生成流程」设定决定，未生成部分保留占位内容。显示设定同时作用于截屏。</span>
          </div>
        </template>
      </UCard>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import type { NarrativeFlags, NarrativeSectionKey, NarrativeSettingKind } from '~/types/narrative'
import { NARRATIVE_SETTING_SECTIONS, type NarrativeSettingSection } from '~/utils/narrativeSections'

const props = defineProps<{ open: boolean; showPlan: NarrativeFlags }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const narrativeStore = useNarrativeStore()
const sections = NARRATIVE_SETTING_SECTIONS

// 生成开关不再受上游限制；显示开关仍依附所属卡片
function isDisabled(section: NarrativeSettingSection, kind: NarrativeSettingKind): boolean {
  if (kind === 'generate') return false
  const dependsOn = section.showDependsOn
  if (!dependsOn) return false
  return !props.showPlan[dependsOn]
}

// 所属卡片未显示时给出明确提示，避免误以为开关失效
function isBlocked(section: NarrativeSettingSection): boolean {
  return isDisabled(section, 'show')
}

function settingHint(section: NarrativeSettingSection): string {
  if (isDisabled(section, 'show')) return '需先显示所属卡片'
  return section.hint
}

function setFlag(kind: NarrativeSettingKind, key: NarrativeSectionKey, value: boolean) {
  narrativeStore[kind][key] = value
}

// 列头点击：在「全开」与「全关」之间切换
function toggleAll(kind: NarrativeSettingKind) {
  const flags = narrativeStore[kind]
  const allOn = (Object.keys(flags) as NarrativeSectionKey[]).every((key) => flags[key])
  narrativeStore.setAll(kind, !allOn)
}
</script>

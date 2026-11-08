<template>
  <UDashboardPanel id="pages-project-narrative-medicine">
    <template #header>
      <UDashboardNavbar title="叙事医学">
        <template #leading>
          <UTooltip text="侧边栏">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
        <template #right>
          <AppHeader />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="nm-page min-h-full w-full overflow-auto py-6 sm:py-8 md:py-10" :data-nm-template="templateId">
        <!-- 截屏按钮：内容页右上角（位于被截取元素之外，避免截图中包含按钮） -->
        <div class="mx-auto mb-2 flex w-full max-w-4xl justify-end px-3 sm:px-4">
          <ButtonCapture capture-id="nm-sheet" label="截屏" />
        </div>

        <div class="mx-auto w-full px-3 sm:px-4">
          <!-- 顶部控制区：疾病设定 + 生成叙事 / 模板 / 设定（位于卡片之外） -->
          <div class="mb-6 flex flex-col items-center gap-4 sm:mb-8">
            <div class="nm-control-label flex items-center gap-2 text-sm font-medium sm:text-base">
              <div class="nm-control-line-left h-px w-10" />
              <div class="nm-control-line-right h-px w-10" />
              <UIcon name="i-lucide-stethoscope" class="text-lg sm:text-xl" />
              <span>疾病设定</span>
              <div class="nm-control-line-right h-px w-10" />
              <div class="nm-control-line-left h-px w-10" />
            </div>

            <div class="flex w-full max-w-2xl flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <UInput
                v-model="disease"
                size="xl"
                icon="i-lucide-search"
                placeholder="请输入任意疾病名称作为设定（例如：偏头痛、肺炎、抑郁症）"
                class="group relative min-w-0 flex-1"
                :ui="{
                  base: 'nm-control-input pl-11 pr-4 py-3 text-base shadow-sm',
                  leading: 'pl-4',
                }"
              />
              <div class="flex flex-wrap items-stretch gap-2 sm:flex-nowrap sm:gap-2.5">
                <!-- 主操作：生成叙事 -->
                <UButton
                  size="xl"
                  icon="i-lucide-sparkles"
                  variant="solid"
                  :loading="isGenerating"
                  :ui="{ base: 'nm-generate-btn text-white' }"
                  class="min-w-32 flex-1 justify-center rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 sm:flex-none"
                  @click="generateNarrative"
                >
                  生成叙事
                </UButton>
                <!-- 显示模板选择 -->
                <NarrativeTemplatePicker />
                <!-- 生成 / 显示设定 -->
                <NarrativeSettingsPopover v-model:open="isSettingsOpen" :show-plan="showPlan" />
              </div>
            </div>
          </div>

          <!-- 叙事医学内容容器（截屏目标：叙事单页） -->
          <NarrativeSheet :template-id="templateId" :data="data" />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import NarrativeSheet from '~/components/Narrative/Sheet.vue'
import NarrativeTemplatePicker from '~/components/Narrative/TemplatePicker.vue'
import NarrativeSettingsPopover from '~/components/Narrative/SettingsPopover.vue'

definePageMeta({
  title: '叙事医学',
})

const narrativeStore = useNarrativeStore()
const { disease, data, showPlan, isSettingsOpen, isGenerating, generateNarrative } = useNarrativeViewModel()

// 模板选择以注册表解析结果为准，本地脏值或已下线模板自动回退默认模板
const templateId = computed(() => resolveNarrativeTemplate(narrativeStore.templateId).id)
</script>

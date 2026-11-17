<template>
  <UCard
    id="component-image-settings"
    :ui="{
      header: 'bg-elevated flex items-center py-2',
      body: 'p-0 sm:p-0 flex flex-col',
      root: 'border border-default overflow-auto',
    }"
  >
    <template #header v-if="isTitleShow">
      <UIcon name="i-lucide-cog" class="mr-2" />
      <span class="font-bold">{{ t('imageSettings.title') }}</span>
    </template>
    <template #default>
      <div class="m-4 flex flex-col gap-4">
        <SelectModel scene="image" />

        <div v-if="showComfyTemplate" class="space-y-4 rounded-lg border border-default p-4">
          <div class="text-sm font-medium">{{ t('settingsPage.comfyTemplatesTitle') }}</div>

          <UFormField
            v-if="isFaceTab"
            :label="t('settingsPage.t2iTemplateTitle')"
            :description="t('settingsPage.t2iTemplateHint')"
          >
            <USelect v-model="t2iTemplate" :items="t2iOptions" variant="soft" size="lg" class="w-full" />
          </UFormField>

          <UFormField
            v-else
            :label="t('settingsPage.editTemplateTitle')"
            :description="t('settingsPage.editTemplateHint')"
          >
            <USelect v-model="editTemplate" :items="editOptions" variant="soft" size="lg" class="w-full" />
          </UFormField>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  tab: { type: String, default: 'face' },
  isTitleShow: { type: Boolean, required: false, default: true },
})

const modelStore = useModelStore()

// 内置模板选项，取值与服务端 server/api/image/providers/templates.ts 的模板 ID 保持一致
const t2iOptions = [
  { label: 'Qwen Image 2.1 Turbo', value: 'qwen-image-2.1-turbo' },
  { label: 'Z-Image Turbo', value: 'z-image-turbo' },
  { label: 'MiniMax H3 Image', value: 'minimax-h3-image' },
  { label: 'MOSS Image', value: 'moss-image' },
  { label: 'Krea 2', value: 'krea2-turbo' },
]
const editOptions = [
  { label: 'Qwen Image 2.1 Turbo Edit', value: 'qwen-image-2.1-turbo-edit' },
  { label: 'MiniMax H3 Image Edit', value: 'minimax-h3-image-edit' },
]

// 头像 Tab 使用文生图模板，插图 Tab 使用图像编辑模板
const isFaceTab = computed(() => props.tab === 'face')
const isIllustrationTab = computed(() => props.tab === 'illustration')

// 与生成调用侧一致：当前图像模型为本地 ComfyUI 时才展示模板选择
const isComfyUI = computed(() => {
  const model = modelStore.activeModels.image
  return model?.provider === 'Custom' && String(model?.name ?? '').trim().toLowerCase() === 'comfyui'
})
const showComfyTemplate = computed(() => isComfyUI.value && (isFaceTab.value || isIllustrationTab.value))

// 直接读写生成调用侧使用的同一份模板配置
const t2iTemplate = computed({
  get: () => modelStore.customModels.image.t2iTemplate ?? 'z-image-turbo',
  set: (val) => {
    modelStore.customModels.image.t2iTemplate = val
  },
})
const editTemplate = computed({
  get: () => modelStore.customModels.image.editTemplate ?? 'qwen-image-2.1-turbo-edit',
  set: (val) => {
    modelStore.customModels.image.editTemplate = val
  },
})
</script>

<template>
  <UDashboardPanel id="pages-settings">
    <template #header>
      <UDashboardNavbar :title="t('settingsPage.title')">
        <template #leading>
          <UTooltip :text="t('common.sidebar')">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar>
    </template>
    <template #body>
      <div class="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UCard :ui="{ header: 'p-0 sm:p-0', body: 'p-5 sm:p-5' }">
          <template #header>
            <div class="flex items-center gap-3 bg-elevated/60 px-5 py-4">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon name="i-lucide-database" class="size-5" />
              </div>
              <div class="min-w-0">
                <h2 class="text-base font-semibold leading-tight">{{ t('settingsPage.storageTitle') }}</h2>
                <p class="text-xs text-muted">{{ t('settingsPage.storageSubtitle') }}</p>
              </div>
            </div>
          </template>
          <div class="divide-y divide-default">
            <div class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-elevated">
                  <Icon name="i-lucide-hard-drive" class="size-4" />
                </div>
                <div class="min-w-0">
                  <div class="text-sm font-medium">{{ t('settingsPage.localStorage') }}</div>
                  <div class="font-mono text-xs text-muted truncate">{{ storageText }} / 5 MB</div>
                </div>
              </div>
              <UButton
                color="warning"
                variant="soft"
                size="sm"
                :label="t('common.clear')"
                @click="openConfirm('local')"
              />
            </div>
            <div class="py-3 first:pt-0 last:pb-0">
              <UProgress :model-value="storagePercent" size="sm" />
            </div>
            <div class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-elevated">
                  <Icon name="i-lucide-cookie" class="size-4" />
                </div>
                <div class="min-w-0">
                  <div class="text-sm font-medium">Cookie</div>
                  <div class="font-mono text-xs text-muted truncate">{{ cookieText }}</div>
                </div>
              </div>
              <UButton
                color="warning"
                variant="ghost"
                size="sm"
                :label="t('common.clear')"
                @click="openConfirm('cookie')"
              />
            </div>
          </div>
        </UCard>

        <UCard :ui="{ header: 'p-0 sm:p-0', body: 'p-5 sm:p-5' }">
          <template #header>
            <div class="flex items-center gap-3 bg-elevated/60 px-5 py-4">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon name="i-lucide-notebook-pen" class="size-5" />
              </div>
              <div class="min-w-0">
                <h2 class="text-base font-semibold leading-tight">{{ t('settingsPage.caseTitle') }}</h2>
                <p class="text-xs text-muted">{{ t('settingsPage.caseSubtitle') }}</p>
              </div>
            </div>
          </template>
          <div class="divide-y divide-default">
            <div class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div class="min-w-0 pr-4">
                <div class="text-sm font-medium">{{ t('settingsPage.showSourceTags') }}</div>
                <div class="text-xs text-muted">{{ t('settingsPage.showSourceTagsHint') }}</div>
              </div>
              <USwitch v-model="stateStore.showCaseFooter" />
            </div>
            <div class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div class="min-w-0 pr-4">
                <div class="text-sm font-medium">{{ t('settingsPage.autoVerify') }}</div>
                <div class="text-xs text-muted">{{ t('settingsPage.autoVerifyHint') }}</div>
              </div>
              <USwitch v-model="stateStore.autoVerify" />
            </div>
            <div class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div class="min-w-0 pr-4">
                <div class="text-sm font-medium">{{ t('settingsPage.autoFix') }}</div>
                <div class="text-xs text-muted">{{ t('settingsPage.autoFixHint') }}</div>
              </div>
              <USwitch
                v-model="stateStore.autoFix"
                :disabled="!stateStore.autoVerify"
              />
            </div>
          </div>
        </UCard>

        <UCard :ui="{ header: 'p-0 sm:p-0', body: 'p-5 sm:p-5' }">
          <template #header>
            <div class="flex items-center gap-3 bg-elevated/60 px-5 py-4">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon name="i-lucide-sliders-horizontal" class="size-5" />
              </div>
              <div class="min-w-0">
                <h2 class="text-base font-semibold leading-tight">{{ t('settingsPage.modelTitle') }}</h2>
                <p class="text-xs text-muted">{{ t('settingsPage.modelSubtitle') }}</p>
              </div>
            </div>
          </template>
          <div class="divide-y divide-default">
            <div
              v-for="modelType in modelTypes"
              :key="modelType.type"
              class="space-y-2 py-3 first:pt-0 last:pb-0"
            >
              <div class="text-sm font-medium">{{ modelType.label }}</div>
              <SelectModelType :type="modelType.type" />
            </div>
          </div>
        </UCard>

        <UCard :ui="{ header: 'p-0 sm:p-0', body: 'p-5 sm:p-5' }">
          <template #header>
            <div class="flex items-center gap-3 bg-elevated/60 px-5 py-4">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon name="i-lucide-plug-zap" class="size-5" />
              </div>
              <div class="min-w-0">
                <h2 class="text-base font-semibold leading-tight">{{ t('settingsPage.customTitle') }}</h2>
                <p class="text-xs text-muted">{{ t('settingsPage.customSubtitle') }}</p>
              </div>
            </div>
          </template>
          <div class="space-y-5">
            <UFormField :label="t('settingsPage.scene')" :description="t('settingsPage.sceneHint')">
              <USelect
                v-model="customScene"
                :items="sceneOptions"
                variant="soft"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <div class="space-y-2">
              <div class="text-sm font-medium">{{ t('settingsPage.quickTemplates') }}</div>
              <p class="text-xs text-muted">{{ t('settingsPage.quickTemplatesHint') }}</p>
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="template in modelTemplates"
                  :key="template.label"
                  :label="template.label"
                  variant="soft"
                  size="sm"
                  @click="applyTemplate(template)"
                />
              </div>
            </div>

            <UAlert
              v-if="showComfyHint"
              :title="t('settingsPage.comfyHintTitle')"
              :description="comfyHint"
              color="warning"
              variant="soft"
            />

            <UFormField :label="t('settingsPage.apiKey')" :description="t('settingsPage.apiKeyHint')">
              <UInput
                v-model="modelStore.customModels[customScene].apiKey"
                :type="showApiKey ? 'text' : 'password'"
                :ui="{ trailing: 'pe-1' }"
                placeholder="sk-..."
                size="lg"
                class="w-full"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="showApiKey ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="showApiKey ? t('settingsPage.hideKey') : t('settingsPage.showKey')"
                    @click="showApiKey = !showApiKey"
                  />
                </template>
              </UInput>
            </UFormField>
            <UFormField :label="t('settingsPage.baseUrl')" :description="t('settingsPage.baseUrlHint')">
              <UInput
                v-model="modelStore.customModels[customScene].baseURL"
                placeholder="https://api.example.com/v1"
                size="lg"
                class="w-full"
              />
            </UFormField>
            <UFormField :label="t('settingsPage.modelName')" :description="t('settingsPage.modelNameHint')">
              <UInput
                v-model="modelStore.customModels[customScene].modelName"
                placeholder="gpt-4o"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <div v-if="showComfyTemplates" class="space-y-4 rounded-lg border border-default p-4">
              <div class="text-sm font-medium">{{ t('settingsPage.comfyTemplatesTitle') }}</div>

              <template v-if="customScene === 'chat'">
                <UFormField
                  :label="t('settingsPage.chatTemplateTitle')"
                  :description="t('settingsPage.chatTemplateHint')"
                >
                  <USelect v-model="chatTemplate" :items="chatOptions" variant="soft" size="lg" class="w-full" />
                </UFormField>
              </template>

              <template v-else-if="customScene === 'video'">
                <UFormField
                  :label="t('settingsPage.i2vTemplateTitle')"
                  :description="t('settingsPage.i2vTemplateHint')"
                >
                  <USelect v-model="i2vTemplate" :items="i2vOptions" variant="soft" size="lg" class="w-full" />
                </UFormField>
              </template>

              <template v-else>
                <UFormField
                  :label="t('settingsPage.t2iTemplateTitle')"
                  :description="t('settingsPage.t2iTemplateHint')"
                >
                  <USelect v-model="t2iTemplate" :items="t2iOptions" variant="soft" size="lg" class="w-full" />
                </UFormField>

                <UFormField
                  :label="t('settingsPage.editTemplateTitle')"
                  :description="t('settingsPage.editTemplateHint')"
                >
                  <USelect v-model="editTemplate" :items="editOptions" variant="soft" size="lg" class="w-full" />
                </UFormField>
              </template>

              <p class="text-xs text-muted">
                {{ t('settingsPage.comfyTemplateNote', { type: customScene === 'chat' ? t('video.remoteChat') : customScene === 'video' ? t('video.remoteVideo') : t('video.remoteImage') }) }}
              </p>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
              <UButton :label="t('common.clearAll')" color="neutral" variant="ghost" @click="clearCustom" />
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>

  <UModal
    v-model:open="modalOpen"
    :title="t('settingsPage.confirmClearTitle')"
    :description="modalMessage"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer="{ close }">
      <UButton :label="t('common.cancel')" color="neutral" variant="ghost" @click="close" />
      <UButton :label="t('settingsPage.confirmClearTitle')" color="error" variant="solid" @click="handleClear" />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { BreadcrumbItem } from '@nuxt/ui'

definePageMeta({
  title: '设置',
})

const { t } = useI18n()
const localePath = useLocalePath()

const items = computed<BreadcrumbItem[]>(() => [
  { label: t('sidebar.overview'), icon: 'i-lucide-house', to: localePath('/dashboard') },
  { label: t('settingsPage.title'), icon: 'i-lucide-settings', to: localePath('/settings') },
])

type CustomScene = 'chat' | 'image' | 'audio' | 'video'
interface ModelTemplate {
  label: string
  baseURL: string
  modelName: string
}

const toast = useToast()
const stateStore = useStateStore()
const modelStore = useModelStore()
const customScene = ref<CustomScene>('chat')
const showApiKey = ref(false)

const modelTypes = computed(() => [
  { type: 'chat', label: t('settingsPage.sceneChat') },
  { type: 'image', label: t('settingsPage.sceneImage') },
  { type: 'video', label: t('settingsPage.sceneVideo') },
  { type: 'audio', label: t('settingsPage.sceneAudio') },
])
const sceneOptions = computed(() => [
  { label: t('settingsPage.sceneChat'), value: 'chat' },
  { label: t('settingsPage.sceneImage'), value: 'image' },
  { label: t('settingsPage.sceneAudio'), value: 'audio' },
  { label: t('settingsPage.sceneVideo'), value: 'video' },
])

// 各场景独立的快捷模板，切换场景时自动展示对应列表；每个场景都提供空白模板
const sceneTemplates = computed<Record<CustomScene, ModelTemplate[]>>(() => {
  const comfyuiTemplate: ModelTemplate = {
    label: t('settingsPage.localComfyUI'),
    baseURL: 'http://127.0.0.1:8188',
    modelName: 'ComfyUI',
  }

  // 空白模板：不带任何预设，仅保留 API Key、Base URL、模型名称三个必填项由用户自行填写
  const blankTemplate: ModelTemplate = {
    label: t('settingsPage.blank'),
    baseURL: '',
    modelName: '',
  }

  return {
    chat: [
      blankTemplate,
      comfyuiTemplate,
      { label: 'OpenRouter', baseURL: 'https://openrouter.ai/api/v1', modelName: 'openrouter/free' },
      { label: 'Ollama Cloud', baseURL: 'https://ollama.com/v1', modelName: '' },
      { label: 'Ollama Local', baseURL: 'http://localhost:11434/v1', modelName: '' },
    ],
    image: [blankTemplate, comfyuiTemplate],
    audio: [blankTemplate, comfyuiTemplate],
    video: [blankTemplate, comfyuiTemplate],
  }
})

const modelTemplates = computed(() => sceneTemplates.value[customScene.value])

// 内置模板选项：文生图二选一，图像编辑、图生视频与文本生成各固定一套
const t2iOptions = [
  { label: 'Qwen Image 2.1 Turbo', value: 'qwen-image-2.1-turbo' },
  { label: 'Z-Image Turbo', value: 'z-image-turbo' },
]
const editOptions = [{ label: 'Qwen Image 2.1 Turbo Edit', value: 'qwen-image-2.1-turbo-edit' }]
const i2vOptions = [
  { label: 'FastVideo FastH3（MiniMax H3 图生视频）', value: 'fastvideo-fasth3-i2v' },
]
const chatOptions = [{ label: 'Qwen3 4B 本地文本生成', value: 'qwen3-text-gen' }]

// 单独代理模板字段，兼容旧持久化数据中缺少新字段的情况
const t2iTemplate = computed({
  get: () => modelStore.customModels.image.t2iTemplate ?? 'z-image-turbo',
  set: (val: string) => {
    modelStore.customModels.image.t2iTemplate = val
  },
})

const editTemplate = computed({
  get: () => modelStore.customModels.image.editTemplate ?? 'qwen-image-2.1-turbo-edit',
  set: (val: string) => {
    modelStore.customModels.image.editTemplate = val
  },
})

const i2vTemplate = computed({
  get: () => modelStore.customModels.video.i2vTemplate ?? 'fastvideo-fasth3-i2v',
  set: (val: string) => {
    modelStore.customModels.video.i2vTemplate = val
  },
})

const chatTemplate = computed({
  get: () => modelStore.customModels.chat.chatTemplate ?? 'qwen3-text-gen',
  set: (val: string) => {
    modelStore.customModels.chat.chatTemplate = val
  },
})

// 与图像调用侧保持一致：模型名称为 ComfyUI（忽略大小写与首尾空格）时才视为本地 ComfyUI
const isLocalComfyUI = computed(
  () => String(modelStore.customModels[customScene.value]?.modelName ?? '').trim().toLowerCase() === 'comfyui',
)

// 对话、图像与视频场景选中「本地 ComfyUI」快捷模板后展示各自的专用模板卡片
const showComfyTemplates = computed(
  () =>
    (customScene.value === 'chat' || customScene.value === 'image' || customScene.value === 'video') &&
    isLocalComfyUI.value,
)

// 使用说明在选中「本地 ComfyUI」后展示；音频场景也保留提示，说明其尚未接入
const showComfyHint = computed(() => isLocalComfyUI.value)

const comfyHint = computed(() => {
  if (customScene.value === 'chat') return t('settingsPage.comfyHintChat')
  if (customScene.value === 'image') return t('settingsPage.comfyHintImage')
  if (customScene.value === 'video') return t('settingsPage.comfyHintVideo')
  return t('settingsPage.comfyHintAudio')
})

function applyTemplate(template: ModelTemplate) {
  const scene = customScene.value
  // 空白模板仅清空接口地址与模型名称，保留已填的 API Key 及三个必填输入项
  modelStore.customModels[scene].baseURL = template.baseURL
  modelStore.customModels[scene].modelName = template.modelName
}

function clearCustom() {
  const scene = customScene.value
  modelStore.customModels[scene] = {
    apiKey: '',
    baseURL: '',
    modelName: '',
    t2iTemplate: 'z-image-turbo',
    editTemplate: 'qwen-image-2.1-turbo-edit',
    i2vTemplate: 'fastvideo-fasth3-i2v',
    chatTemplate: 'qwen3-text-gen',
  }
}

const modalOpen = ref(false)
const clearType = ref<'local' | 'cookie'>('local')

const modalMessage = computed(() => {
  if (clearType.value === 'local') {
    return t('settingsPage.clearLocalMessage')
  }
  return t('settingsPage.clearCookieMessage')
})

function openConfirm(type: 'local' | 'cookie') {
  clearType.value = type
  modalOpen.value = true
}

const storageBytes = ref(0)
const cookieBytes = ref(0)
const STORAGE_LIMIT = 5 * 1024 * 1024

function calcStorageUsage() {
  try {
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!
      const value = localStorage.getItem(key)!
      total += key.length + value.length
    }
    storageBytes.value = total
  } catch {
    storageBytes.value = 0
  }
}

const storageText = computed(() => {
  const b = storageBytes.value
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(2)} MB`
})

const storagePercent = computed(() => {
  return Math.min((storageBytes.value / STORAGE_LIMIT) * 100, 100)
})

const cookieText = computed(() => {
  const b = cookieBytes.value
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(2)} MB`
})

function calcCookieUsage() {
  try {
    const cookies = document.cookie.split(';')
    let total = 0
    for (const c of cookies) {
      const eq = c.indexOf('=')
      if (eq > -1) {
        total += c.substring(0, eq).trim().length + c.substring(eq + 1).length
      } else {
        total += c.trim().length
      }
    }
    cookieBytes.value = total
  } catch {
    cookieBytes.value = 0
  }
}

function handleClear() {
  if (clearType.value === 'local') {
    localStorage.clear()
    calcStorageUsage()
    toast.add({ title: t('settingsPage.toastLocalCleared'), color: 'success' })
  } else {
    clearAllCookies()
    calcCookieUsage()
    toast.add({
      title: t('settingsPage.toastCookieCleared'),
      description: t('settingsPage.toastCookieNote'),
      color: 'success',
    })
  }
  modalOpen.value = false
}

function clearAllCookies() {
  document.cookie.split(';').forEach((c) => {
    const eq = c.indexOf('=')
    const name = eq > -1 ? c.substring(0, eq).trim() : c.trim()
    if (!name) return
    document.cookie = `${name}=; max-age=0; path=/`
    document.cookie = `${name}=; max-age=0; path=${location.pathname}`
  })
}

watch(() => stateStore.autoVerify, (val) => {
  if (!val) stateStore.autoFix = false
})

onMounted(() => {
  calcStorageUsage()
  calcCookieUsage()
})
</script>

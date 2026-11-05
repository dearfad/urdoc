<template>
  <UDashboardPanel id="pages-settings">
    <template #header>
      <UDashboardNavbar title="设置">
        <template #leading>
          <UTooltip text="侧边栏">
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
                <h2 class="text-base font-semibold leading-tight">存储管理</h2>
                <p class="text-xs text-muted">本地缓存与 Cookie 占用情况</p>
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
                  <div class="text-sm font-medium">本地存储</div>
                  <div class="font-mono text-xs text-muted truncate">{{ storageText }} / 5 MB</div>
                </div>
              </div>
              <UButton
                color="warning"
                variant="soft"
                size="sm"
                label="清除"
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
                label="清除"
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
                <h2 class="text-base font-semibold leading-tight">病历</h2>
                <p class="text-xs text-muted">病历生成与校验偏好</p>
              </div>
            </div>
          </template>
          <div class="divide-y divide-default">
            <div class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div class="min-w-0 pr-4">
                <div class="text-sm font-medium">显示来源标签</div>
                <div class="text-xs text-muted">在病历卡片底部显示教科书来源和自定义标签</div>
              </div>
              <USwitch v-model="stateStore.showCaseFooter" />
            </div>
            <div class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div class="min-w-0 pr-4">
                <div class="text-sm font-medium">生成后自动校验</div>
                <div class="text-xs text-muted">病历生成完成后自动进行校验</div>
              </div>
              <USwitch v-model="stateStore.autoVerify" />
            </div>
            <div class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div class="min-w-0 pr-4">
                <div class="text-sm font-medium">校验不通过时自动更正</div>
                <div class="text-xs text-muted">校验未通过时自动进行更正</div>
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
                <h2 class="text-base font-semibold leading-tight">模型设定</h2>
                <p class="text-xs text-muted">为各场景指定默认模型</p>
              </div>
            </div>
          </template>
          <div class="divide-y divide-default">
            <div
              v-for="t in modelTypes"
              :key="t.type"
              class="space-y-2 py-3 first:pt-0 last:pb-0"
            >
              <div class="text-sm font-medium">{{ t.label }}</div>
              <SelectModelType :type="t.type" />
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
                <h2 class="text-base font-semibold leading-tight">自定义模型</h2>
                <p class="text-xs text-muted">配置自建或第三方模型</p>
              </div>
            </div>
          </template>
          <div class="space-y-5">
            <UFormField label="场景" description="选择要绑定的模型场景">
              <USelect
                v-model="customScene"
                :items="sceneOptions"
                variant="soft"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <div class="space-y-2">
              <div class="text-sm font-medium">快捷模板</div>
              <p class="text-xs text-muted">选择「空白」可自行填写 API Key、Base URL 与模型名称，不使用任何预设</p>
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="t in modelTemplates"
                  :key="t.label"
                  :label="t.label"
                  variant="soft"
                  size="sm"
                  @click="applyTemplate(t)"
                />
              </div>
            </div>

            <UAlert
              v-if="showComfyHint"
              title="本地 ComfyUI 使用说明"
              :description="comfyHint"
              color="warning"
              variant="soft"
            />

            <UFormField label="API Key" description="自定义提供商的密钥（如不需要可留空）">
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
                    :aria-label="showApiKey ? '隐藏密钥' : '显示密钥'"
                    @click="showApiKey = !showApiKey"
                  />
                </template>
              </UInput>
            </UFormField>
            <UFormField label="Base URL" description="自定义提供商的接口地址">
              <UInput
                v-model="modelStore.customModels[customScene].baseURL"
                placeholder="https://api.example.com/v1"
                size="lg"
                class="w-full"
              />
            </UFormField>
            <UFormField label="模型名称" description="填写后，对应场景的模型选择器将出现 “Custom” 提供商">
              <UInput
                v-model="modelStore.customModels[customScene].modelName"
                placeholder="gpt-4o"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <div v-if="showComfyTemplates" class="space-y-4 rounded-lg border border-default p-4">
              <div class="text-sm font-medium">本地 ComfyUI 模板（专用）</div>

              <template v-if="customScene === 'chat'">
                <UFormField
                  label="本地文本生成模板"
                  description="用于对话及病例、故事、试题、评价等所有文本生成，使用本机已安装的模型"
                >
                  <USelect v-model="chatTemplate" :items="chatOptions" variant="soft" size="lg" class="w-full" />
                </UFormField>
              </template>

              <template v-else-if="customScene === 'video'">
                <UFormField
                  label="本地图生视频模板"
                  description="用于「影像渲染」，以已生成的患者头像作为首帧生成视频"
                >
                  <USelect v-model="i2vTemplate" :items="i2vOptions" variant="soft" size="lg" class="w-full" />
                </UFormField>
              </template>

              <template v-else>
                <UFormField
                  label="本地文生图模板"
                  description="用于「自定义生成」与「生成患者头像」，使用本机已安装的模型出图"
                >
                  <USelect v-model="t2iTemplate" :items="t2iOptions" variant="soft" size="lg" class="w-full" />
                </UFormField>

                <UFormField
                  label="本地图像编辑模板"
                  description="用于「故事插图」，以已生成的患者头像作为输入图进行编辑"
                >
                  <USelect v-model="editTemplate" :items="editOptions" variant="soft" size="lg" class="w-full" />
                </UFormField>
              </template>

              <p class="text-xs text-muted">
                以上模板仅对本地 ComfyUI 生效；模型名称为其他值时，将走自定义远端{{
                  customScene === 'chat'
                    ? 'OpenAI 兼容对话'
                    : customScene === 'video'
                      ? '视频'
                      : 'OpenAI 兼容图像'
                }}
                API。
              </p>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
              <UButton label="清空" color="neutral" variant="ghost" @click="clearCustom" />
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>

  <UModal
    v-model:open="modalOpen"
    title="确认清除"
    :description="modalMessage"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer="{ close }">
      <UButton label="取消" color="neutral" variant="ghost" @click="close" />
      <UButton label="确认清除" color="error" variant="solid" @click="handleClear" />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { BreadcrumbItem } from '@nuxt/ui'

definePageMeta({
  title: '设置',
})

const items = computed<BreadcrumbItem[]>(() => [
  { label: '概览', icon: 'i-lucide-house', to: '/dashboard' },
  { label: '设置', icon: 'i-lucide-settings', to: '/settings' },
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

const modelTypes = [
  { type: 'chat', label: '对话' },
  { type: 'image', label: '图像' },
  { type: 'video', label: '视频' },
  { type: 'audio', label: '音频' },
]
const sceneOptions = [
  { label: '对话', value: 'chat' },
  { label: '图像', value: 'image' },
  { label: '音频', value: 'audio' },
  { label: '视频', value: 'video' },
]

const comfyuiTemplate: ModelTemplate = {
  label: '本地 ComfyUI',
  baseURL: 'http://127.0.0.1:8188',
  modelName: 'ComfyUI',
}

// 空白模板：不带任何预设，仅保留 API Key、Base URL、模型名称三个必填项由用户自行填写
const blankTemplate: ModelTemplate = {
  label: '空白',
  baseURL: '',
  modelName: '',
}

// 各场景独立的快捷模板，切换场景时自动展示对应列表；每个场景都提供空白模板
const sceneTemplates: Record<CustomScene, ModelTemplate[]> = {
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

const modelTemplates = computed(() => sceneTemplates[customScene.value])

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
  if (customScene.value === 'chat') {
    return (
      '本地 ComfyUI 需与本服务同机启动，云端部署无法访问本机地址；' +
      '当前已启用下方本地文本生成模板，使用本机 Qwen3 4B 完成对话与病例、故事、试题、评价等文本生成；' +
      '系统指令与对话历史会合并为一段提示词送入工作流，流式响应在生成完成后一次性返回；' +
      '若把模型名称改为其他值，则按自定义远端 OpenAI 兼容对话 API 调用。'
    )
  }
  if (customScene.value === 'image') {
    return (
      '本地 ComfyUI 需与本服务同机启动，云端部署无法访问本机地址；' +
      '当前已启用下方本地模板设置；若把模型名称改为其他值，则按自定义远端 OpenAI 兼容图像 API 调用。' +
      '故事插图使用已生成的患者头像作为输入图。'
    )
  }
  if (customScene.value === 'video') {
    return (
      '本地 ComfyUI 需与本服务同机启动，云端部署无法访问本机地址；' +
      '当前已启用下方本地图生视频模板，以已生成的患者头像作为首帧，需本机安装 MiniMax H3 / FastVideo FastH3 相关模型；' +
      '视频尺寸由首帧图决定、帧率固定 24 FPS；若把模型名称改为其他值，则按自定义远端视频 API 调用。'
    )
  }
  return '本地 ComfyUI 需与本服务同机启动，云端部署无法访问本机地址；当前仅对话、图像与视频场景已接入，音频暂未接入。'
})

function applyTemplate(t: ModelTemplate) {
  const scene = customScene.value
  // 空白模板仅清空接口地址与模型名称，保留已填的 API Key 及三个必填输入项
  modelStore.customModels[scene].baseURL = t.baseURL
  modelStore.customModels[scene].modelName = t.modelName
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
    return '确定要清除所有本地存储数据吗？此操作不可撤销，将重置所有本地设置和缓存。'
  }
  return '确定要清除所有 Cookie 吗？清除后可能需要重新登录部分服务。'
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
    toast.add({ title: '已清除 localStorage', color: 'success' })
  } else {
    clearAllCookies()
    calcCookieUsage()
    toast.add({
      title: '已清除 Cookie',
      description: '部分 HttpOnly Cookie 无法通过 JS 清除',
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

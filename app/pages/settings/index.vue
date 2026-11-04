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
              v-if="customScene !== 'chat'"
              title="ComfyUI 使用说明"
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
  label: 'ComfyUI',
  baseURL: 'http://127.0.0.1:8188',
  modelName: 'ComfyUI',
}

// 各场景独立的快捷模板，切换场景时自动展示对应列表
const sceneTemplates: Record<CustomScene, ModelTemplate[]> = {
  chat: [
    { label: 'OpenRouter', baseURL: 'https://openrouter.ai/api/v1', modelName: 'openrouter/free' },
    { label: 'Ollama Cloud', baseURL: 'https://ollama.com/v1', modelName: '' },
    { label: 'Ollama Local', baseURL: 'http://localhost:11434/v1', modelName: '' },
  ],
  image: [comfyuiTemplate],
  audio: [comfyuiTemplate],
  video: [comfyuiTemplate],
}

const modelTemplates = computed(() => sceneTemplates[customScene.value])

const comfyHint = computed(() => {
  if (customScene.value === 'image') {
    return '需与本服务同机启动，云端部署无法访问本机地址；模型名称请保持「ComfyUI」，且本机需已安装文生图 checkpoint（如 SD1.5 / SDXL）。当前仅图像场景已接入生图，故事插图暂不使用参考图。'
  }
  return '需与本服务同机启动，云端部署无法访问本机地址；当前仅图像场景已接入生图，音频与视频暂未接入。'
})

function applyTemplate(t: ModelTemplate) {
  const scene = customScene.value
  modelStore.customModels[scene].baseURL = t.baseURL
  modelStore.customModels[scene].modelName = t.modelName
}

function clearCustom() {
  const scene = customScene.value
  modelStore.customModels[scene] = { apiKey: '', baseURL: '', modelName: '' }
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

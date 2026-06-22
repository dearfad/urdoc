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
      <div class="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">存储管理</h2>
          </template>
          <div class="space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-2 min-w-0">
                  <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-elevated">
                    <Icon name="i-lucide-database" class="size-4" />
                  </div>
                  <div class="min-w-0">
                    <div class="text-sm font-medium">本地存储</div>
                    <div class="font-mono text-xs text-muted truncate">{{ storageText }} / 5 MB</div>
                  </div>
                </div>
                <UButton
                  color="warning"
                  variant="solid"
                  size="sm"
                  label="清除"
                  @click="openConfirm('local')"
                />
              </div>
              <UProgress :model-value="storagePercent" size="sm" />
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-2 min-w-0">
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
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">病历</h2>
          </template>
          <div class="space-y-6">
            <div class="flex items-center justify-between gap-4">
              <div>
                <div class="text-sm font-medium">显示来源标签</div>
                <div class="text-xs text-muted">在病历卡片底部显示教科书来源和自定义标签</div>
              </div>
              <USwitch v-model="stateStore.showCaseFooter" />
            </div>
            <div class="flex items-center justify-between gap-4">
              <div>
                <div class="text-sm font-medium">生成后自动校验</div>
                <div class="text-xs text-muted">病历生成完成后自动进行校验</div>
              </div>
              <USwitch v-model="stateStore.autoVerify" />
            </div>
            <div class="flex items-center justify-between gap-4">
              <div>
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

const toast = useToast()
const stateStore = useStateStore()
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

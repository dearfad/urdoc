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
      <div class="p-4 md:p-6">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">存储管理</h2>
          </template>
          <div class="space-y-4">
            <div>
              <div class="mb-1 flex items-center justify-between">
                <span class="text-sm text-muted">localStorage 已用空间</span>
                <span class="font-mono text-sm">{{ storageText }} / 5 MB</span>
              </div>
              <UProgress :model-value="storagePercent" size="sm" />
            </div>
            <div class="flex flex-col gap-3 sm:flex-row">
              <UButton
                color="error"
                variant="solid"
                size="lg"
                label="清除 localStorage"
                class="flex-1"
                @click="openConfirm('local')"
              />
              <UButton
                color="error"
                variant="outline"
                size="lg"
                label="清除 Cookie"
                class="flex-1"
                @click="openConfirm('cookie')"
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
definePageMeta({
  title: '设置',
})

import type { BreadcrumbItem } from '@nuxt/ui'

const items = ref<BreadcrumbItem[]>([
  {
    label: '设置',
    icon: 'i-lucide-settings',
    to: '/settings',
  },
])

const toast = useToast()
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

function handleClear() {
  if (clearType.value === 'local') {
    localStorage.clear()
    calcStorageUsage()
    toast.add({ title: '已清除 localStorage', color: 'success' })
  } else {
    clearAllCookies()
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

onMounted(() => {
  calcStorageUsage()
})
</script>

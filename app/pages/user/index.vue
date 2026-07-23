<template>
  <UDashboardPanel id="pages-user">
    <template #header>
      <UDashboardNavbar title="用户">
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
      <div class="divide-border-muted divide-y">
        <!-- Hero 区域 - 用户信息概览 -->
        <div class="px-6 py-8 lg:px-8">
          <div class="flex items-center gap-4">
            <div
              class="from-primary to-primary/70 flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg"
            >
              <Icon name="i-lucide-user" class="size-8 text-white" />
            </div>
            <div>
              <h1 class="text-highlighted text-2xl font-bold">
                {{ session ? session.user?.name || '管理员' : '欢迎登录' }}
              </h1>
              <p class="text-muted mt-1">
                {{ session ? '已登录账户' : '请登录您的账户以继续' }}
              </p>
            </div>
          </div>
        </div>

        <!-- 功能区域 -->
        <div class="px-6 py-8 lg:px-8">
          <div class="grid gap-6 lg:grid-cols-3">
            <!-- 账号卡片 - 主要内容 -->
            <UCard class="lg:col-span-2">
              <template #header>
                <div class="bg-elevated flex items-center gap-3 py-2">
                  <Icon name="i-lucide-shield" class="text-primary size-5" />
                  <span class="text-highlighted font-semibold">账号管理</span>
                </div>
              </template>
              <div class="space-y-6">
                <!-- 已登录状态 -->
                <div v-if="session" class="space-y-6">
                  <!-- 用户信息展示 -->
                  <div class="bg-elevated/50 flex items-center gap-4 rounded-xl p-4">
                    <div class="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-full">
                      <Icon name="i-lucide-user" class="text-primary size-6" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="text-highlighted text-lg font-semibold">
                        {{ session.user?.name || '管理员' }}
                      </div>
                      <div class="text-muted text-sm">当前登录用户</div>
                    </div>
                    <div
                      class="bg-success/10 text-success flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                    >
                      <Icon name="i-lucide-check-circle" class="size-3.5" />
                      <span>在线</span>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex flex-col gap-3 sm:flex-row">
                    <UButton
                      label="退出登录"
                      color="error"
                      variant="outline"
                      size="lg"
                      icon="i-lucide-log-out"
                      class="sm:w-auto"
                      @click="showLogoutConfirm = true"
                    />
                  </div>
                </div>

                <!-- 未登录状态 - 登录表单 -->
                <div v-else>
                  <UForm :state="{ name, password }" class="space-y-5" @submit.prevent="handleLogin">
                    <UFormField name="name" label="用户名">
                      <UInput
                        v-model="name"
                        placeholder="请输入用户名"
                        size="lg"
                        icon="i-lucide-user"
                        :disabled="loading"
                      />
                    </UFormField>

                    <UFormField name="password" label="密码">
                      <UInput
                        v-model="password"
                        type="password"
                        placeholder="请输入密码"
                        size="lg"
                        icon="i-lucide-lock"
                        :disabled="loading"
                      />
                    </UFormField>

                    <UAlert
                      v-if="error"
                      :description="error"
                      color="error"
                      variant="subtle"
                      icon="i-lucide-alert-circle"
                    />

                    <UButton type="submit" label="登录" :loading="loading" block size="lg" icon="i-lucide-log-in" />
                  </UForm>
                </div>
              </div>
            </UCard>

            <!-- 密码哈希工具 -->
            <UCard>
              <template #header>
                <div class="bg-elevated flex items-center gap-3 py-2">
                  <Icon name="i-lucide-key-round" class="text-warning size-5" />
                  <span class="text-highlighted font-semibold">哈希工具</span>
                </div>
              </template>
              <div class="space-y-5">
                <p class="text-muted text-sm leading-relaxed">将明文密码转换为安全的哈希值，用于密码存储和验证。</p>

                <UFormField label="明文密码" description="输入要转换的密码">
                  <UInput v-model="hashInput" placeholder="请输入明文密码" size="lg" icon="i-lucide-key" />
                </UFormField>

                <UButton
                  label="生成哈希"
                  :loading="hashLoading"
                  size="lg"
                  block
                  icon="i-lucide-hammer"
                  :disabled="!hashInput"
                  @click="generateHash"
                />

                <div v-if="hashResult" class="space-y-3">
                  <UFormField label="哈希结果">
                    <UInput :model-value="hashResult" readonly size="lg">
                      <template #leading>
                        <Icon name="i-lucide-hash" class="text-muted size-4" />
                      </template>
                      <template #trailing>
                        <UButton
                          :icon="hashCopied ? 'i-lucide-check' : 'i-lucide-copy'"
                          variant="ghost"
                          color="neutral"
                          size="xs"
                          @click="copyHash"
                        />
                      </template>
                    </UInput>
                  </UFormField>

                  <UAlert
                    v-if="hashCopied"
                    description="已复制到剪贴板"
                    color="success"
                    variant="subtle"
                    icon="i-lucide-check-circle"
                  />
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <!-- 退出登录确认对话框 -->
  <UModal v-model:open="showLogoutConfirm">
    <template #header>
      <div class="flex items-center gap-3">
        <Icon name="i-lucide-alert-triangle" class="text-warning size-5" />
        <span class="text-highlighted font-semibold">确认退出</span>
      </div>
    </template>
    <template #body>
      <p class="text-muted">确定要退出当前账户吗？退出后需要重新登录。</p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton label="取消" variant="ghost" color="neutral" @click="showLogoutConfirm = false" />
        <UButton label="退出登录" color="error" icon="i-lucide-log-out" @click="handleLogout" />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { BreadcrumbItem } from '@nuxt/ui'

definePageMeta({
  title: '用户',
})

const items = computed<BreadcrumbItem[]>(() => [
  { label: '概览', icon: 'i-lucide-house', to: '/dashboard' },
  { label: '用户', icon: 'i-lucide-user', to: '/user' },
])

const { fetch: fetchSession, clear, session } = useUserSession()
const toast = useToast()

const name = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showLogoutConfirm = ref(false)

// Hash 工具
const hashInput = ref('')
const hashResult = ref('')
const hashLoading = ref(false)
const hashCopied = ref(false)

async function handleLogout() {
  showLogoutConfirm.value = false
  try {
    await clear()
    toast.add({
      title: '已退出登录',
      color: 'success',
      icon: 'i-lucide-check-circle',
    })
  } catch {
    toast.add({
      title: '退出失败',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    })
  }
}

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { name: name.value, password: password.value },
    })
    await fetchSession()
    toast.add({
      title: '登录成功',
      color: 'success',
      icon: 'i-lucide-check-circle',
    })
  } catch (e: any) {
    error.value = e.data?.message || '登录失败'
    toast.add({
      title: '登录失败',
      description: error.value,
      color: 'error',
      icon: 'i-lucide-alert-circle',
    })
  } finally {
    loading.value = false
  }
}

async function generateHash() {
  if (!hashInput.value) return
  hashLoading.value = true
  hashResult.value = ''
  hashCopied.value = false

  try {
    const res = await $fetch<{ hash: string }>('/api/admin/hash', {
      params: { password: hashInput.value },
    })
    hashResult.value = res.hash
    toast.add({
      title: '哈希生成成功',
      color: 'success',
      icon: 'i-lucide-check-circle',
    })
  } catch (e: any) {
    hashResult.value = '生成失败: ' + (e.data?.message || e.message)
    toast.add({
      title: '生成失败',
      description: e.data?.message || e.message,
      color: 'error',
      icon: 'i-lucide-alert-circle',
    })
  } finally {
    hashLoading.value = false
  }
}

async function copyHash() {
  if (!hashResult.value) return
  await navigator.clipboard.writeText(hashResult.value)
  hashCopied.value = true
  toast.add({
    title: '已复制到剪贴板',
    color: 'success',
    icon: 'i-lucide-check',
  })
  setTimeout(() => (hashCopied.value = false), 2000)
}
</script>

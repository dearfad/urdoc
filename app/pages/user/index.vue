<template>
  <UDashboardPanel id="pages-user">
    <template #header>
      <UDashboardNavbar :title="t('user.title')">
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
                {{ session ? session.user?.name || t('user.admin') : t('user.welcome') }}
              </h1>
              <p class="text-muted mt-1">
                {{ session ? t('user.loggedIn') : t('user.loginHint') }}
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
                  <span class="text-highlighted font-semibold">{{ t('user.accountManagement') }}</span>
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
                        {{ session.user?.name || t('user.admin') }}
                      </div>
                      <div class="text-muted text-sm">{{ t('user.currentUser') }}</div>
                    </div>
                    <div
                      class="bg-success/10 text-success flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                    >
                      <Icon name="i-lucide-check-circle" class="size-3.5" />
                      <span>{{ t('user.online') }}</span>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex flex-col gap-3 sm:flex-row">
                    <UButton
                      :label="t('user.logout')"
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
                    <UFormField name="name" :label="t('user.username')">
                      <UInput
                        v-model="name"
                        :placeholder="t('user.usernamePlaceholder')"
                        size="lg"
                        icon="i-lucide-user"
                        :disabled="loading"
                      />
                    </UFormField>

                    <UFormField name="password" :label="t('user.password')">
                      <UInput
                        v-model="password"
                        type="password"
                        :placeholder="t('user.passwordPlaceholder')"
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

                    <UButton type="submit" :label="t('user.login')" :loading="loading" block size="lg" icon="i-lucide-log-in" />
                  </UForm>
                </div>
              </div>
            </UCard>

            <!-- 密码哈希工具 -->
            <UCard>
              <template #header>
                <div class="bg-elevated flex items-center gap-3 py-2">
                  <Icon name="i-lucide-key-round" class="text-warning size-5" />
                  <span class="text-highlighted font-semibold">{{ t('user.hashTool') }}</span>
                </div>
              </template>
              <div class="space-y-5">
                <p class="text-muted text-sm leading-relaxed">{{ t('user.hashDescription') }}</p>

                <UFormField :label="t('user.plainPassword')" :description="t('user.plainPasswordHint')">
                  <UInput v-model="hashInput" :placeholder="t('user.plainPasswordPlaceholder')" size="lg" icon="i-lucide-key" />
                </UFormField>

                <UButton
                  :label="t('user.generateHash')"
                  :loading="hashLoading"
                  size="lg"
                  block
                  icon="i-lucide-hammer"
                  :disabled="!hashInput"
                  @click="generateHash"
                />

                <div v-if="hashResult" class="space-y-3">
                  <UFormField :label="t('user.hashResult')">
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
                    :description="t('common.copied')"
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
        <span class="text-highlighted font-semibold">{{ t('user.confirmLogout') }}</span>
      </div>
    </template>
    <template #body>
      <p class="text-muted">{{ t('user.logoutConfirmText') }}</p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton :label="t('common.cancel')" variant="ghost" color="neutral" @click="showLogoutConfirm = false" />
        <UButton :label="t('user.logout')" color="error" icon="i-lucide-log-out" @click="handleLogout" />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { BreadcrumbItem } from '@nuxt/ui'

definePageMeta({
  title: '用户',
})

const { t } = useI18n()
const localePath = useLocalePath()

const items = computed<BreadcrumbItem[]>(() => [
  { label: t('sidebar.overview'), icon: 'i-lucide-house', to: localePath('/dashboard') },
  { label: t('user.title'), icon: 'i-lucide-user', to: localePath('/user') },
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
      title: t('user.logoutSuccess'),
      color: 'success',
      icon: 'i-lucide-check-circle',
    })
  } catch {
    toast.add({
      title: t('user.logoutFailed'),
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
      title: t('user.loginSuccess'),
      color: 'success',
      icon: 'i-lucide-check-circle',
    })
  } catch (e: any) {
    error.value = e.data?.message || t('user.loginFailed')
    toast.add({
      title: t('user.loginFailed'),
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
      title: t('user.hashSuccess'),
      color: 'success',
      icon: 'i-lucide-check-circle',
    })
  } catch (e: any) {
    hashResult.value = t('user.hashFailedPrefix') + (e.data?.message || e.message)
    toast.add({
      title: t('user.hashFailed'),
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
    title: t('common.copied'),
    color: 'success',
    icon: 'i-lucide-check',
  })
  setTimeout(() => (hashCopied.value = false), 2000)
}
</script>

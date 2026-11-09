<template>
  <UDashboardPanel id="pages-cstar-case">
    <template #header>
      <UDashboardNavbar :title="t('sidebar.generateCase')">
        <template #leading>
          <UTooltip :text="t('common.sidebar')">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
        <template #right>
          <AppHeader />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <UBreadcrumb :items="items" />

      </UDashboardToolbar>
    </template>
    <template #body>
      <RecordFlow />
      <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto md:flex-row">
        <Case
          v-show="isDesktop || !settingsVisible"
          :settingsVisible="settingsVisible"
          class="flex min-h-0 w-full flex-col flex-1 md:flex-2"
          @toggleSettings="toggleSettings"
        />
        <CaseSettings v-show="settingsVisible" class="flex min-h-0 w-full flex-col flex-1" @close="toggleSettings" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

definePageMeta({
  title: '生成病例',
})

const { t } = useI18n()
const localePath = useLocalePath()

const settingsVisible = ref(true)
const isDesktop = ref(true)

onMounted(() => {
  const mq = window.matchMedia('(min-width: 768px)')
  isDesktop.value = mq.matches
  settingsVisible.value = mq.matches
  mq.addEventListener('change', (e) => { isDesktop.value = e.matches })
})

function toggleSettings() {
  settingsVisible.value = !settingsVisible.value
}

const items = computed<BreadcrumbItem[]>(() => [
  { label: t('sidebar.overview'), icon: 'i-lucide-house', to: localePath('/dashboard') },
  { label: t('sidebar.cstar'), icon: 'i-lucide-circle-star' },
  { label: t('sidebar.generateCase'), icon: 'i-mdi-alpha-c-circle', to: localePath('/cstar/case') },
])

</script>

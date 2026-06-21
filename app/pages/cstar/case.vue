<template>
  <UDashboardPanel id="pages-cstar-case">
    <template #header>
      <UDashboardNavbar title="生成病例">
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
definePageMeta({
  title: '生成病例',
})
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

</script>

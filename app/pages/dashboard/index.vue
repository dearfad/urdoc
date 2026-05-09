<template>
  <UDashboardPanel id="pages-dashboard-index">
    <template #header>
      <UDashboardNavbar title="概览">
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
      <div class="flex flex-row items-center">
        <span>最新提交时间</span><UButton @click="getLastCommitDateAll" label="获取" class="mx-2"></UButton>
      </div>
      <div class="flex flex-row items-center">
        <UBadge :label="lastCommitDate.main" variant="soft" class="mx-2" /><span
          >正式站：https://urdoc.dearfad.com</span
        >
      </div>
      <div class="flex flex-row items-center">
        <UBadge :label="lastCommitDate.develop" variant="soft" class="mx-2" /><span
          >开发站：https://dev.urdoc.dearfad.com</span
        >
      </div>
      <div class="flex flex-row items-center">
        <UBadge :label="lastCommitDate.docs" variant="soft" class="mx-2" /><span
          >文档站：https://docs.urdoc.dearfad.com</span
        >
      </div>
      <div class="flex flex-row items-center">
        <UButton label="生成病例" size="xl" to="/cstar/case" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
const lastCommitDate = ref({
  main: '',
  develop: '',
  docs: '',
})

async function getLastCommitDate(branch) {
  return await $fetch('/api/github/commit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      branch: branch,
    },
  })
}

async function getLastCommitDateAll() {
  lastCommitDate.value.main = await getLastCommitDate('main')
  lastCommitDate.value.develop = await getLastCommitDate('develop')
  lastCommitDate.value.docs = await getLastCommitDate('docs')
}
</script>

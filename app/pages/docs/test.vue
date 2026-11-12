<template>
  <UDashboardPanel id="docs-test">
    <template #header>
      <UDashboardNavbar :title="page?.title ?? 'Test'">
        <template #leading>
          <UTooltip :text="t('common.sidebar')">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
        <template #right>
          <AppHeader />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="mx-auto max-w-3xl px-6 py-8 lg:px-8">
        <ContentRenderer v-if="page" :value="page" />
        <div v-else class="text-muted py-20 text-center">
          Test document not found.
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const { t } = useI18n()

const { data: page } = await useAsyncData('content-test', () =>
  queryCollection('docs').path('/docs/test').first(),
)
</script>

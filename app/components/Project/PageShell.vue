<template>
  <UDashboardPanel :id="id">
    <template #header>
      <UDashboardNavbar :title="title">
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
      <div v-if="!flush" class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <slot />
      </div>
      <slot v-else />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string
    title: string
    flush?: boolean
  }>(),
  { flush: false }
)

const { t } = useI18n()
</script>

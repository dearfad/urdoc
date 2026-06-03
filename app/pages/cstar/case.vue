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
      <UDashboardToolbar>
        <UBreadcrumb :items="items" />
        <template #right v-if="siblings.length">
          <div class="flex gap-1 overflow-x-auto">
            <NuxtLink
              v-for="sib in siblings"
              :key="sib.to"
              :to="sib.to"
              class="size-6 flex items-center justify-center rounded-full text-[11px] font-bold leading-none transition-colors shrink-0"
              :class="route.path === sib.to
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-default hover:bg-muted'"
              :title="sib.label"
            >
              {{ sib.abbr }}
            </NuxtLink>
          </div>
        </template>
      </UDashboardToolbar>
    </template>
    <template #body>
      <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto md:flex-row">
        <Case class="flex min-h-0 w-full flex-col flex-1 md:flex-2" />
        <CaseSettings class="flex min-h-0 w-full flex-col md:flex-1" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  title: '生成病例',
})
const route = useRoute()
const { items, siblings } = useBreadcrumb()
</script>

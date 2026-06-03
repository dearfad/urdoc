<template>
  <!-- <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto my-4 px-2 ga-4">
    <VoiceUtilsGenerate />
    <VoiceUtilsGenerateDialogue />
    <ModelCard model-type="audio" />
  </v-sheet> -->
  <UDashboardPanel id="pages-multimodal-audio">
    <template #header>
      <UDashboardNavbar title="音频合成">
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
      <CardCase />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  title: '音频合成',
})

const route = useRoute()
const { items, siblings } = useBreadcrumb()
</script>

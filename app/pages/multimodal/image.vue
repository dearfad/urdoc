<template>
  <!-- 
        <FaceContentShow />
        <FaceContentPrompt />
        <FaceUtilsGenerate />
        <StoryContentIllustration />
        <CommonPutOSS />
        <StoryUtilsGenerateIllustration />
-->
  <UDashboardPanel id="pages-multimodal-image">
    <template #header>
      <UDashboardNavbar title="图像创作">
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
      <div class="flex flex-col gap-2 md:flex-row">
        <Image class="w-full md:flex-2" />
        <ImageSettings class="w-full md:flex-1" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  title: '图像创作',
})
const route = useRoute()
const { items, siblings } = useBreadcrumb()
</script>

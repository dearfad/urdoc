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
import type { BreadcrumbItem } from '@nuxt/ui'

definePageMeta({
  title: '图像创作',
})
const items = computed<BreadcrumbItem[]>(() => [
  { label: '概览', icon: 'i-lucide-house', to: '/dashboard' },
  { label: '多模态', icon: 'i-lucide-file-stack' },
  { label: '图像创作', icon: 'i-lucide-image', to: '/multimodal/image' },
])
</script>

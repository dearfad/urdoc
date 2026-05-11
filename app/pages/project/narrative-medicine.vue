<template>
  <!-- <v-container id="narrative-medicine-container" fluid class="w-100 w-md-66">
    <v-row>
      <v-col cols="12" class="d-flex flex-column ga-4">
        <ProjectNarrativeMedicineGenBtn />
        <ProjectNarrativeMedicineOptionCard />
        <CommonCaptureButton capture-id="narrative-medicine-container" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3">
        <FaceContentShow />
      </v-col>
      <v-col cols="12" md="9">
        <CaseContentMarkdown />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3">
        <StoryContentIllustration />
      </v-col>
      <v-col cols="12" md="9" class="d-flex flex-column ga-4">
        <StoryContentMarkdown />
        <StoryContentConversation />
        <StoryContentDiscussion />
        <StoryContentComment />
      </v-col>
    </v-row>
  </v-container> -->
  <UDashboardPanel id="pages-project-narrative-medicine">
    <template #header>
      <UDashboardNavbar title="叙事医学">
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
        <div class="ms-auto flex gap-2">
          <UButton icon="i-lucide-copy-plus" variant="ghost" @click="copyAll" />
        </div>
      </UDashboardToolbar>
    </template>
    <template #body>
      <div class="flex flex-col gap-4 xl:flex-row">
        <Case class="xl:w-2/5" />
        <Story class="xl:w-3/5" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  title: '叙事医学',
})
import type { BreadcrumbItem } from '@nuxt/ui'
const caseStore = useCaseStore()
const storyStore = useStoryStore()
const toast = useToast()

async function copyAll() {
  const text = `病例内容：\n${JSON.stringify(caseStore.case.content, null, 2)}\n\n故事内容：\n${storyStore.story.content}`
  try {
    await navigator.clipboard.writeText(text)
    toast.add({ title: '已复制到剪贴板', color: 'success', icon: 'i-lucide-check-circle', duration: 2000 })
  } catch {
    toast.add({ title: '复制失败', color: 'error', icon: 'i-lucide-alert-circle' })
  }
}

const items = ref<BreadcrumbItem[]>([
  {
    label: '首页',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: '叙事医学',
    icon: 'i-lucide-book',
    to: '/project/narrative-medicine',
  },
])
</script>

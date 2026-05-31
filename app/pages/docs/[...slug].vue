<template>
  <UDashboardPanel id="pages-docs-slug">
    <template #header>
      <UDashboardNavbar :title="title">
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
        <UBreadcrumb :items="breadcrumbItems" />
      </UDashboardToolbar>
    </template>
    <template #body>
      <div v-if="error" class="flex flex-col items-center justify-center py-20">
        <UIcon name="i-lucide-file-question" class="text-muted size-16" />
        <h2 class="text-highlighted mt-4 text-xl font-semibold">文档未找到</h2>
        <p class="text-muted mt-2">请检查路径是否正确，或返回文档首页。</p>
        <UButton to="/docs" class="mt-6" label="返回文档首页" color="neutral" variant="subtle" />
      </div>
      <div v-else-if="loading" class="flex items-center justify-center py-20">
        <ULoadingIcon class="size-8" />
      </div>
      <div v-else class="mx-auto max-w-3xl px-6 py-8 lg:px-8">
        <article class="prose prose-zinc dark:prose-invert max-w-none">
          <Comark :markdown="content" />
        </article>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { getDocTitle } from '~/utils/docs'

const route = useRoute()
const slug = (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug) || 'index'

const title = getDocTitle(slug)

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: '概览', to: '/dashboard' },
  { label: '文档', to: '/docs' },
  {
    label: title,
    ...(slug !== 'index' ? {} : {}),
  },
])

const content = ref('')
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    const text = await $fetch<string>(`/docs/${slug}.md`, {
      responseType: 'text',
    })
    content.value = text
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})

// 页面切换时重新加载
watch(
  () => slug,
  async () => {
    loading.value = true
    error.value = false
    content.value = ''
    try {
      const text = await $fetch<string>(`/docs/${slug}.md`, {
        responseType: 'text',
      })
      content.value = text
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  },
)
</script>

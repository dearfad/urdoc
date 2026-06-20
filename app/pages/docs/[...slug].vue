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
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin" />
      </div>
      <div v-else class="mx-auto max-w-3xl px-6 py-8 lg:px-8">
        <Comark :markdown="content" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { getDocTitle, getDocContent } from '~/utils/docs'

const route = useRoute()
const slug = computed(() =>
  (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug) || 'index',
)

const title = computed(() => getDocTitle(slug.value))

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: '概览', icon: 'i-lucide-house', to: '/dashboard' },
  { label: '文档', icon: 'i-lucide-book-open-text', to: '/docs' },
  { label: title.value, to: route.path },
])

const { data: content, error, pending: loading } = useAsyncData(
  `doc-${slug.value}`,
  () => getDocContent(slug.value),
  { watch: [slug] },
)
</script>

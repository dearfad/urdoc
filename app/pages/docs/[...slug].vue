<template>
  <UDashboardPanel id="pages-docs-slug">
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
      <UDashboardToolbar>
        <UBreadcrumb :items="breadcrumbItems" />
      </UDashboardToolbar>
    </template>
    <template #body>
      <div v-if="error" class="flex flex-col items-center justify-center py-20">
        <UIcon name="i-lucide-file-question" class="text-muted size-16" />
        <h2 class="text-highlighted mt-4 text-xl font-semibold">{{ t('docsPage.notFound') }}</h2>
        <p class="text-muted mt-2">{{ t('docsPage.notFoundHint') }}</p>
        <UButton :to="localePath('/docs')" class="mt-6" :label="t('common.backToDocs')" color="neutral" variant="subtle" />
      </div>
      <div v-else-if="loading" class="flex items-center justify-center py-20">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin" />
      </div>
      <div v-else class="mx-auto max-w-3xl px-6 py-8 lg:px-8">
        <Markdown :value="content" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { getDocTitle, getDocContent } from '~/utils/docs'

const { t } = useI18n()
const localePath = useLocalePath()

const route = useRoute()
const slug = computed(() =>
  (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug) || 'index',
)

const title = computed(() => getDocTitle(slug.value))

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: t('sidebar.overview'), icon: 'i-lucide-house', to: localePath('/dashboard') },
  { label: t('sidebar.docs'), icon: 'i-lucide-book-open-text', to: localePath('/docs') },
  { label: title.value, to: route.path },
])

const { data: content, error, pending: loading } = useAsyncData(
  `doc-${slug.value}`,
  () => getDocContent(slug.value),
  { watch: [slug] },
)
</script>

<template>
  <UDashboardPanel id="pages-docs-index">
    <template #header>
      <UDashboardNavbar title="文档">
        <template #leading>
          <UTooltip text="侧边栏">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
        <template #right>
          <AppHeader />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="divide-border-muted divide-y">
        <div class="px-6 py-10 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <h1 class="text-highlighted text-4xl font-bold tracking-tight">文档</h1>
            <p class="text-muted mt-2 text-lg">URDOC 平台使用指南与开发参考</p>
            <p class="text-default mt-4 leading-relaxed">
              浏览以下文档了解平台的各项功能、使用方法和最佳实践。
            </p>
          </div>
        </div>

        <div class="px-6 py-8 lg:px-8">
          <div class="mx-auto max-w-4xl space-y-10">
            <div v-for="section in docNav" :key="'label' in section ? section.slug : section.label" class="space-y-4">
              <template v-if="'slug' in section">
                <NuxtLink
                  :to="`/docs/${section.slug}`"
                  class="group flex items-center gap-3 rounded-lg p-4 transition-colors hover:bg-(--ui-bg-elevated)"
                >
                  <UIcon :name="section.icon" class="text-primary size-6 shrink-0" />
                  <div class="min-w-0 flex-1">
                    <h3 class="text-highlighted font-semibold group-hover:text-(--ui-primary)">{{ section.label }}</h3>
                    <p v-if="section.description" class="text-muted mt-0.5 text-sm">{{ section.description }}</p>
                  </div>
                  <UIcon name="i-lucide-chevron-right" class="text-muted size-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </NuxtLink>
              </template>
              <template v-else>
                <div class="mb-3 flex items-center gap-2">
                  <UIcon :name="section.icon" class="text-primary size-5" />
                  <h2 class="text-highlighted text-lg font-semibold">{{ section.label }}</h2>
                </div>
                <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <NuxtLink
                    v-for="child in section.children"
                    :key="child.slug"
                    :to="`/docs/${child.slug}`"
                    class="group flex items-center gap-3 rounded-lg border border-(--ui-border) p-4 transition-all hover:border-(--ui-primary) hover:shadow-sm"
                  >
                    <UIcon :name="child.icon" class="text-primary size-5 shrink-0" />
                    <span class="text-highlighted font-medium group-hover:text-(--ui-primary)">{{ child.label }}</span>
                  </NuxtLink>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { docNav } from '~/utils/docs'
</script>

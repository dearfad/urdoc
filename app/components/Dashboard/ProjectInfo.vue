<template>
  <section class="px-6 py-8 lg:px-8">
    <h2 class="text-highlighted flex items-center gap-2 text-lg font-semibold">
      <UIcon name="i-lucide-info" class="text-primary size-5" />
      {{ t('dashboard.project.title') }}
    </h2>
    <p class="text-muted mt-1 text-sm">{{ t('dashboard.project.subtitle') }}</p>

    <div class="mt-5 grid gap-4 lg:grid-cols-3">
      <!-- 技术栈 -->
      <UCard variant="subtle" :ui="{ body: 'p-5' }">
        <h3 class="text-highlighted flex items-center gap-2 text-sm font-semibold">
          <UIcon name="i-lucide-layers" class="text-primary size-4" />
          {{ t('dashboard.project.stack') }}
        </h3>
        <div class="mt-4 flex flex-wrap gap-2">
          <UBadge v-for="item in stack" :key="item" color="neutral" variant="outline" size="sm" class="font-mono">
            {{ item }}
          </UBadge>
        </div>
        <div class="border-default mt-5 border-t pt-3">
          <p class="text-muted text-xs">{{ t('dashboard.project.opensource') }} · MIT</p>
        </div>
      </UCard>

      <!-- 精选文档 -->
      <UCard variant="subtle" :ui="{ body: 'p-5' }">
        <h3 class="text-highlighted flex items-center gap-2 text-sm font-semibold">
          <UIcon name="i-lucide-book-open" class="text-primary size-4" />
          {{ t('dashboard.project.docs') }}
        </h3>
        <div class="mt-3 space-y-0.5">
          <NuxtLink
            v-for="doc in docs"
            :key="doc.href"
            :to="localePath(doc.href)"
            class="group hover:bg-elevated flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors"
          >
            <UIcon :name="doc.icon" class="text-primary size-4 shrink-0" />
            <span class="text-default min-w-0 flex-1 truncate text-sm">{{ doc.label }}</span>
            <UIcon
              name="i-lucide-arrow-up-right"
              class="text-muted size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </NuxtLink>
        </div>
      </UCard>

      <!-- 在线站点与部署状态 -->
      <UCard variant="subtle" :ui="{ body: 'p-5' }">
        <h3 class="text-highlighted flex items-center gap-2 text-sm font-semibold">
          <UIcon name="i-lucide-globe" class="text-primary size-4" />
          {{ t('dashboard.project.links') }}
        </h3>
        <div class="mt-3 space-y-2">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="group border-default bg-elevated/30 hover:border-primary/40 flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all"
          >
            <UIcon :name="link.icon" :class="link.color" class="size-4 shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="text-highlighted truncate text-sm font-medium">{{ link.label }}</p>
              <p class="text-muted truncate font-mono text-xs">{{ host(link.href) }}</p>
            </div>
            <UIcon name="i-lucide-external-link" class="text-muted size-3.5 shrink-0" />
          </a>
        </div>
        <div class="border-default mt-4 border-t pt-3">
          <p class="text-highlighted text-xs font-medium">{{ t('card.deployStatus') }}</p>
          <p class="text-muted mt-1 text-xs leading-relaxed">{{ t('dashboard.project.deploymentHint') }}</p>
        </div>
      </UCard>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const stack = ['Nuxt 4', 'Vue 3', 'Nuxt UI v4', 'Tailwind CSS v4', 'AI SDK', 'Pinia', 'TypeScript', 'EdgeOne']

const docs = computed(() => [
  { label: t('dashboard.project.docsIndex'), icon: 'i-lucide-book-open', href: '/docs' },
  { label: t('dashboard.project.docsGettingStarted'), icon: 'i-lucide-rocket', href: '/docs/getting-started' },
  { label: t('dashboard.project.docsProject'), icon: 'i-lucide-info', href: '/docs/project' },
  { label: t('dashboard.project.docsCstar'), icon: 'i-lucide-circle-star', href: '/docs/cstar/index' },
  { label: t('dashboard.project.docsApi'), icon: 'i-lucide-route', href: '/docs/development/api-guide' },
])

const links = computed(() => [
  {
    label: t('dashboard.project.productionSite'),
    icon: 'i-lucide-globe',
    color: 'text-success',
    href: 'https://urdoc.dearfad.com',
  },
  {
    label: t('dashboard.project.developmentSite'),
    icon: 'i-lucide-flask-conical',
    color: 'text-warning',
    href: 'https://dev.urdoc.dearfad.com',
  },
  {
    label: t('dashboard.project.repository'),
    icon: 'i-simple-icons-github',
    color: 'text-primary',
    href: 'https://github.com/dearfad/urdoc',
  },
])

function host(href: string): string {
  return href.replace(/^https?:\/\//, '')
}
</script>

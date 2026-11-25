<template>
  <ProjectPageShell
    :id="`pages-project-${projectSlug}-${subSlug}`"
    :title="t(item.labelKey)"
  >
    <div class="mb-6">
      <h1 class="text-highlighted text-2xl font-semibold">{{ t(item.labelKey) }}</h1>
      <p class="text-muted mt-1 text-sm">{{ t(item.descriptionKey) }}</p>
    </div>

    <div
      class="border-default bg-elevated/30 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center"
    >
      <span class="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-2xl">
        <UIcon :name="item.icon" class="size-7" />
      </span>
      <UBadge :label="t('projectPage.common.comingSoon')" color="neutral" variant="subtle" size="sm" class="mt-4" />
      <h2 class="text-highlighted mt-3 text-lg font-semibold">{{ t('projectPage.common.comingSoonTitle') }}</h2>
      <p class="text-muted mt-2 max-w-md text-sm leading-relaxed">{{ t('projectPage.common.comingSoonDesc') }}</p>
      <UButton
        :to="localePath(project.path)"
        :label="t('projectPage.common.backToProject')"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="subtle"
        class="mt-6"
      />
    </div>
  </ProjectPageShell>
</template>

<script setup lang="ts">
import { findProjectGroup } from '~/utils/project'

const props = defineProps<{
  projectSlug: string
  subSlug: string
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const project = computed(() => {
  const found = findProjectGroup(props.projectSlug)
  if (!found) throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  return found
})

const item = computed(() => {
  const found = project.value.children.find((child) => child.slug === props.subSlug)
  if (!found) throw createError({ statusCode: 404, statusMessage: 'Subproject not found' })
  return found
})
</script>

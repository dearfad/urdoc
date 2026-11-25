<template>
  <ProjectPageShell
    id="pages-project-narrative-medicine"
    :title="t('sidebar.narrativeMedicine')"
  >
    <div class="mb-8">
      <h1 class="text-highlighted text-2xl font-semibold sm:text-3xl">{{ t('projectPage.narrativeMedicine.title') }}</h1>
      <p class="text-muted mt-2 max-w-2xl text-sm leading-relaxed sm:text-base">
        {{ t('projectPage.narrativeMedicine.description') }}
      </p>
    </div>

    <ProjectCardGrid
      :items="project.children"
      :title-key="'projectPage.common.subprojectList'"
      :description-key="'projectPage.common.subprojectListDescription'"
    />
  </ProjectPageShell>
</template>

<script setup lang="ts">
import { findProjectGroup } from '~/utils/project'

definePageMeta({
  title: '叙事医学',
})

const { t } = useI18n()

const project = computed(() => {
  const found = findProjectGroup('narrative-medicine')
  if (!found) throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  return found
})
</script>

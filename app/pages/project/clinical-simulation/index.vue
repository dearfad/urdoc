<template>
  <ProjectPageShell
    id="pages-project-clinical-simulation"
    :title="t('sidebar.clinicalSimulation')"
  >
    <div class="mb-8">
      <h1 class="text-highlighted text-2xl font-semibold sm:text-3xl">{{ t('projectPage.clinicalSimulation.title') }}</h1>
      <p class="text-muted mt-2 max-w-2xl text-sm leading-relaxed sm:text-base">
        {{ t('projectPage.clinicalSimulation.description') }}
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
  title: '临床实战',
})

const { t } = useI18n()

const project = computed(() => {
  const found = findProjectGroup('clinical-simulation')
  if (!found) throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  return found
})
</script>

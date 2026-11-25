<template>
  <ProjectPageShell id="pages-project-index" :title="t('sidebar.projects')">
    <div class="mb-8">
      <h1 class="text-highlighted text-2xl font-semibold sm:text-3xl">{{ t('projectPage.overview.title') }}</h1>
      <p class="text-muted mt-2 text-sm leading-relaxed sm:text-base">{{ t('projectPage.overview.description') }}</p>
    </div>

    <ProjectCardGrid
      :items="projectGroups"
      :title-key="'projectPage.overview.listTitle'"
      :description-key="'projectPage.overview.listDescription'"
      icon="i-lucide-folder-kanban"
    />
  </ProjectPageShell>
</template>

<script setup lang="ts">
import { projectGroups } from '~/utils/project'

definePageMeta({
  title: '项目总览',
})

const { t } = useI18n()
</script>

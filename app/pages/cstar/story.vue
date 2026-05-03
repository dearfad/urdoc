<template>
  <!-- <v-sheet class="d-flex flex-column w-100 w-md-66 mx-auto my-4 px-2 ga-4">
    <CommonRecordTools />
    <StoryContentShow />
    <StoryUtilsGenerate />
    <StoryContentConversation />
    <StoryUtilsGenerateConversation />
    <StoryContentDiscussion />
    <StoryUtilsGenerateDiscussion />
    <StoryContentComment />
    <StoryUtilsGenerateComment />
  </v-sheet> -->
  <UDashboardPanel id="pages-cstar-story">
    <template #header>
      <UDashboardNavbar title="编写故事">
        <template #leading>
          <UTooltip text="侧边栏">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar />
    </template>
    <template #body>
      <div class="flex flex-col gap-2 md:flex-row">
        <Story class="w-full md:flex-2" />
        <StorySettings class="w-full md:flex-1" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
definePageMeta({
  title: '编写故事',
})
</script>

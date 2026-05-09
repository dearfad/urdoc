<template>
  <!-- <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto my-4 px-2 ga-4">
    <PoseContentShow />
    <PoseContentPrompt />
    <PoseUtilsGenerate />
  </v-sheet> -->
  <UDashboardPanel id="pages-multimodal-video">
    <template #header>
      <UDashboardNavbar title="视频渲染">
        <template #leading>
          <UTooltip text="侧边栏">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
        <template #right>
          <AppHeader />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar />
    </template>
    <template #body>
      <CardCase />
    </template>
  </UDashboardPanel>
</template>

<script setup>
definePageMeta({
  title: '视频渲染',
})
</script>

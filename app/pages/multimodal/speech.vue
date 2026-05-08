<template>
  <!-- <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto my-4 px-2 ga-4">
    <VoiceUtilsGenerate />
    <VoiceUtilsGenerateDialogue />
    <ModelCard model-type="audio" />
  </v-sheet> -->
  <UDashboardPanel id="pages-multimodal-speech">
    <template #header>
      <UDashboardNavbar title="语音合成">
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
  title: '语音合成',
})
</script>

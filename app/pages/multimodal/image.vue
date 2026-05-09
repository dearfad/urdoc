<template>
  <!-- <v-container fluid class="w-100 w-md-66">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <FaceContentShow />
        <FaceContentPrompt />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="9">
        <FaceUtilsGenerate />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <StoryContentIllustration />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="9">
        <CommonPutOSS />
        <StoryUtilsGenerateIllustration />
      </v-col>
    </v-row>
  </v-container> -->
  <UDashboardPanel id="pages-multimodal-image">
    <template #header>
      <UDashboardNavbar title="图像创作">
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
  title: '图像创作',
})
</script>

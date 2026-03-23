<template>
  <v-container id="narrative-medicine-container" fluid class="w-100 w-md-66">
    <v-row>
      <v-col cols="12" class="d-flex flex-column ga-4">
        <ProjectNarrativeMedicineGenBtn />
        <ProjectNarrativeMedicineOptionCard />
        <!-- <CommonCaptureButton capture-id="narrative-medicine-container" /> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3">
        <FaceContentShow />
      </v-col>
      <v-col cols="12" md="9">
        <CaseContentMarkdown />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3">
        <StoryContentIllustration />
      </v-col>
      <v-col cols="12" md="9" class="d-flex flex-column ga-4">
        <StoryContentMarkdown />
        <StoryContentConversation />
        <StoryContentDiscussion />
        <StoryContentComment />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  title: '叙事医学',
})
</script>

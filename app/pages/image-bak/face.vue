<template>
  <v-container fluid class="w-100 w-md-66">
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
        <!-- <CommonPutOSS /> -->
        <StoryUtilsGenerateIllustration />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  title: '头像生成',
})
</script>

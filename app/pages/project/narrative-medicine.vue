<template>
  <v-container fluid class="w-100 w-md-75">
    <v-row>
      <v-col cols="12" class="d-flex flex-column ga-4">
        <v-btn block text="开始生成" :loading="isLoading" size="large" @click="generate">
          <template #loader>
            <v-progress-circular indeterminate color="white" class="mr-4" />
            {{ field }}
          </template>
        </v-btn>
        <CommonScopeSelector />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3">
        <FaceContentShow height="" />
        <StoryContentIllustration height="" />
      </v-col>
      <v-col cols="12" md="9" class="d-flex flex-column ga-4">
        <CaseContentMarkdown />
        <StoryContentMarkdown />
        <!-- <StoryContentConversation height="" />
          <StoryContentDiscussion height="" /> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  title: '叙事医学',
})
const recordStore = useRecordStore()
const isLoading = ref(false)
const field = ref('')

async function generate() {
  //
  isLoading.value = true
  // 病例
  field.value = '生成病例...'
  await recordStore.getCase()
  // 故事
  field.value = '生成故事...'
  await recordStore.getStory()
  // 对话
  // field.value = '生成对话&头像...'
  // await Promise.all([recordStore.getConversation(), recordStore.getFace()])
  // 讨论
  // field.value = '生成讨论$插图...'
  // await Promise.all([recordStore.getDiscussion(), recordStore.getStoryIllustration()])
  //
  isLoading.value = false
}
</script>

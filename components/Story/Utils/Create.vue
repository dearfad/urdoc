<template>
  <v-sheet class="d-flex flex-column mx-4">
    <v-btn
      :loading="isLoading"
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      text="生成故事"
      @click="getStory"
    >
      <template #loader>
        <v-progress-circular indeterminate color="white" class="mr-4" />
        正在生成...{{ stateStore.modelResponseField }}
      </template>
    </v-btn>
    <v-sheet class="px-4 my-4" elevation="4" rounded="lg">
      <v-text-field
        v-model="caseStore.storyTag"
        placeholder="真实"
        class="my-4"
        label="设定"
        variant="outlined"
        hide-details="auto"
        clearable
        density="comfortable"
      />
    </v-sheet>
    <CommonModelSelector model-type="chat" model-usage="story" />
  </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
const stateStore = useStateStore()
const promptStore = usePromptStore()
const modelRouter = useModelRouter()
const isLoading = ref(false)

async function getStory() {
  isLoading.value = true
  stateStore.isModelResponseStringShow = true
  caseStore.caseStory = ''
  const messages = [
    { role: 'system', content: promptStore.storyPrompt },
    {
      role: 'user',
      content: caseStore.caseContentMarkdown + '\n设定：' + caseStore.storyTag,
    },
  ]

  try {
    caseStore.caseStory = JSON.parse(await modelRouter.getStory(messages))
  } catch (error) {
    caseStore.caseStory = ''
    stateStore.appInfo = error
  }

  stateStore.isModelResponseStringShow = false
  isLoading.value = false
}
</script>

<template>
  <v-sheet class="d-flex flex-column mx-4">
    <CommonGenerateButton generate-type="story" />
    <CommonCustomConfig config-type="story" />
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

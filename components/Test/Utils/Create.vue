<template>
  <v-sheet class="d-flex flex-column mx-4">
    <CommonGenerateButton generate-type="test" />
    <CommonCustomConfig config-type="test" />
    <CommonModelSelector model-type="chat" model-usage="test" />
  </v-sheet>
</template>

<script setup>
const isLoading = ref(false)
const stateStore = useStateStore()
const promptStore = usePromptStore()
const caseStore = useCaseStore()
const modelRouter = useModelRouter()

async function getTest() {
  isLoading.value = true
  stateStore.isModelResponseStringShow = true
  caseStore.caseTest = ''
  const messages = [
    { role: 'system', content: promptStore.testPrompt },
    {
      role: 'user',
      content: caseStore.caseContentMarkdown + caseStore.testTag,
    },
  ]
  try {
    caseStore.caseTest = JSON.parse(await modelRouter.getTest(messages))
  } catch (error) {
    caseStore.caseTest = ''
    stateStore.appInfo = error
  }
  stateStore.isModelResponseStringShow = false
  isLoading.value = false
}
</script>

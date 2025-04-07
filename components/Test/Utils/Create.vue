<template>
  <v-sheet class="d-flex flex-column mx-4">
    <v-btn
      :loading="isLoading"
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      text="生成问题"
      @click="getTest"
    >
      <template #loader>
        <v-progress-circular indeterminate color="white" class="mr-4" />
        正在生成...{{ stateStore.modelResponseField }}
      </template>
    </v-btn>
    <v-sheet class="px-4 my-4" elevation="4" rounded="lg">
      <v-text-field
        v-model="caseStore.testTag"
        class="my-4"
        label="设定"
        variant="outlined"
        hide-details="auto"
        clearable
        density="comfortable"
    /></v-sheet>
    <CommonModelSelector model-type="chat" model-usage="test" />
    <CommonApiBaseUrlSelector />
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
  caseStore.caseTest = JSON.parse(await modelRouter.getTest(messages))
  stateStore.isModelResponseStringShow = false
  isLoading.value = false
}
</script>

<template>
  <v-sheet class="d-flex flex-column">
    <v-text-field v-model="caseStore.testTag" label="设定" />
    <CommonModelSelector />
    <v-btn :loading="isLoading" block text="生成问题" @click="getTest">
      <template #loader>
        <v-progress-circular indeterminate color="white" class="mr-4" />
        正在生成...{{ stateStore.modelResponseField }}
      </template>
    </v-btn>
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
  const messages = [
    { role: 'system', content: promptStore.testPrompt },
    {
      role: 'user',
      content: caseStore.caseContentMarkdown + caseStore.testTag,
    },
  ]
  caseStore.caseTest = JSON.parse(await modelRouter.getTest(messages))
  isLoading.value = false
}
</script>

<template>
  <v-sheet class="d-flex flex-column">
    <v-text-field v-model="caseStore.storyTag" label="设定" placeholder="真实" />
    <CommonModelSelector />
    <v-btn :loading="isLoading" block @click="getStory">
      生成故事
      <template #loader>
        <v-progress-circular indeterminate color="white" class="mr-4" />
        正在生成...{{ stateStore.modelResponseField }}
      </template>
    </v-btn>
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
  const messages = [
    { role: 'system', content: promptStore.storyPrompt },
    {
      role: 'user',
      content: caseStore.caseContentMarkdown + '\n设定：' + caseStore.storyTag,
    },
  ]
  caseStore.caseStory = JSON.parse(await modelRouter.getStory(messages))
  isLoading.value = false
}
</script>

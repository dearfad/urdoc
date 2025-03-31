<template>
  <v-sheet class="d-flex flex-column mx-4">
    <v-btn
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      text="生成病例"
      :loading="isLoading"
      @click="genCase"
    >
      <template #loader>
        <v-progress-circular indeterminate color="white" class="mr-4" />
        {{ stateStore.modelResponseField }}
      </template>
    </v-btn>
    <v-sheet class="px-4 my-4" elevation="4" rounded="lg">
      <v-text-field
        v-model="caseStore.caseTag"
        class="my-4"
        label="设定"
        variant="outlined"
        hide-details="auto"
        clearable
        density="comfortable"
        placeholder="多个要点请用空格隔开"
      />
    </v-sheet>
    <CommonChapterSelector />
    <CommonModelSelector models-type="chatModels" />
    <CommonPromptSelector />
  </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
// 生成状态提示
const isLoading = ref(false)

const modelRouter = useModelRouter()
const caseStore = useCaseStore()
const promptStore = usePromptStore()

async function genCase() {
  // 重置状态
  caseStore.$reset()
  // 提示生成中
  isLoading.value = true
  stateStore.isModelResponseStringShow = true
  // 构造prompt
  const messages = [
    { role: 'system', content: promptStore.casePrompt },
    {
      role: 'user',
      content:
        '病例要点设定：\n' +
        stateStore.selectedBook +
        '\n' +
        stateStore.selectedChapter +
        '\n' +
        stateStore.selectedSection +
        '\n' +
        stateStore.selectedSubsection +
        '\n' +
        caseStore.caseTag,
    },
  ]

  caseStore.caseContent = JSON.parse(await modelRouter.getCase(messages))
  stateStore.isModelResponseStringShow = false
  isLoading.value = false
}
</script>

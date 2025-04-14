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
        v-model="stateStore.tags.case"
        class="my-4"
        label="设定"
        variant="outlined"
        hide-details="auto"
        clearable
        density="comfortable"
        placeholder="多个要点请用空格隔开"
      />
    </v-sheet>
    <CommonBookSelector />
    <CommonModelSelector model-type="chat" model-usage="case" />
    <CommonPromptSelector />
    <CommonApiBaseUrlSelector />
  </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
const recordStore = useRecordStore()
const isLoading = ref(false)

async function genCase() {
  recordStore.$reset()
  isLoading.value = true
  stateStore.isModelResponseStringShow = true
  await recordStore.getCase()
  stateStore.isModelResponseStringShow = false
  isLoading.value = false
}
</script>

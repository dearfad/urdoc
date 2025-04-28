<template>
  <v-card hover height="600" rounded="lg">
    <!-- <v-sheet class="px-4 my-3" elevation="4" rounded="lg"> -->
    <v-select
      v-model="item"
      label="提示词"
      :items="items"
      item-title="title"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      prepend-inner-icon="mdi-file-word-box-outline"
      density="comfortable"
      @update:model-value="handlePromptChange"
    />
    <v-btn text="列表" @click="promptStore.getPrompts" />
    <!-- </v-sheet> -->
  </v-card>
</template>

<script setup>
const { modelType, modelUsage } = defineProps({
  modelType: { type: String, required: true },
  modelUsage: { type: String, required: true },
})
const item = ref()
const promptStore = usePromptStore()
const items = ref(promptStore.prompts.system[modelUsage].user)
function handlePromptChange() {}
</script>

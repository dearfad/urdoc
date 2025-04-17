<template>
  <v-sheet class="px-4 my-3" elevation="4" rounded="lg">
    <v-select
      v-model="item"
      label="提示词"
      :items="items"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      prepend-inner-icon="mdi-file-word-box-outline"
      density="comfortable"
      disabled
      @update:model-value="handlePromptChange"
    />
  </v-sheet>
</template>

<script setup>
const { modelType, modelUsage } = defineProps({
  modelType: { type: String, required: true },
  modelUsage: { type: String, required: true },
})
const item = ref()
const items = ref(['标准病历', '职业医师考试'])
function handlePromptChange() {}
</script>

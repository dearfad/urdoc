<template>
  <v-sheet class="px-4 my-3" elevation="4" rounded="lg">
    <v-select
      v-model="stateStore.selectedPlatform"
      label="平台"
      :items="platforms"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      @update:model-value="handlePlatformChange"
    />
    <v-select
      v-model="stateStore.selectedModel"
      label="模型"
      :items="models"
      item-title="name"
      item-value="id"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      return-object
    />
  </v-sheet>
</template>

<script setup>
const modelStore = useModelStore()
const stateStore = useStateStore()

const platforms = computed(() => {
  return [...Object.keys(modelStore.models)]
})

const models = computed(() => {
  return modelStore.models[stateStore.selectedPlatform] || []
})

function handlePlatformChange() {
  stateStore.selectedModel = models.value[0]
}
</script>

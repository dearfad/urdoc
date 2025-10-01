<template>
  <v-card hover class="px-4 py-2" rounded="lg">
    <v-select
      v-model="localModel.provider"
      :items="['OLLAMA', 'COMFYUI']"
      label="服务商"
      variant="outlined"
      class="mt-4"
      density="comfortable"
      @update:model-value="setActiveModel"
    />
    <v-select
      v-model="localModel.thinking"
      :items="[
        { name: '否', id: false },
        { name: '是', id: true },
      ]"
      variant="outlined"
      label="思考模型"
      item-title="name"
      item-value="id"
      @update:model-value="setActiveModel"
    />
    <v-text-field
      v-model="localModel.model"
      variant="outlined"
      label="模型"
      @update:model-value="setActiveModel"
    />
  </v-card>
</template>

<script setup>
const { modelType, modelUsage } = defineProps({
  modelType: { type: String, required: true },
  modelUsage: { type: String, required: true },
})
const modelStore = useModelStore()
const localModel = ref({
  provider: '',
  model: '',
  thinking: false,
})

watch(
  () => modelStore.activeModels[modelType][modelUsage],
  (newActiveModel) => {
    if (newActiveModel && newActiveModel.source === 'local') {
      localModel.value.provider = newActiveModel.provider
      localModel.value.model = newActiveModel.model
      localModel.value.thinking = newActiveModel.thinking
    } else {
      localModel.value.provider = ''
      localModel.value.model = ''
      localModel.value.thinking = false
    }
  },
  { immediate: true }
)

function setActiveModel() {
  modelStore.activeModels[modelType][modelUsage] = {
    source: 'local',
    provider: localModel.value.provider,
    model: localModel.value.model,
    thinking: localModel.value.thinking,
  }
}
</script>

<template>
  <v-card hover rounded="lg">
    <v-select
      v-model="localModel.provider"
      :items="['OLLAMA', 'COMFYUI']"
      label="服务商"
      variant="outlined"
      class="my-4"
      density="comfortable"
      hide-details="auto"
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
      hide-details="auto"
      @update:model-value="setActiveModel"
    />
    <v-text-field
      v-model="localModel.model"
      variant="outlined"
      label="模型"
      class="mt-4"
      hide-details="auto"
      @update:model-value="setActiveModel"
    />
    <v-checkbox-btn
      v-if="modelUsage !== 'default'"
      v-model="isSetModelDefault"
      hide-details="true"
      @update:model-value="handleModelChange"
    >
      <template #label><span class="text-body-2 font-weight-bold">设为默认</span></template>
    </v-checkbox-btn>
  </v-card>
</template>

<script setup>
const { modelType, modelUsage } = defineProps({
  modelType: { type: String, required: true },
  modelUsage: { type: String, required: true },
})
const modelStore = useModelStore()

const isSetModelDefault = ref(true)

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
  const modelData = {
    source: 'local',
    provider: localModel.value.provider,
    model: localModel.value.model,
    thinking: localModel.value.thinking,
  }
  if (isSetModelDefault.value) {
    modelStore.activeModels[modelType]['default'] = modelData
    if (modelUsage !== 'default') modelStore.activeModels[modelType][modelUsage] = null
  } else {
    modelStore.activeModels[modelType][modelUsage] = modelData
  }
}
</script>

<template>
  <v-card hover class="px-4 py-2" rounded="lg">
    <v-select
      v-model="provider"
      :items="providers"
      label="服务商"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      @update:model-value="handleProviderChange"
    />
    <v-select
      v-model="model"
      label="模型"
      :items="modelsByProvider"
      item-title="model"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      return-object
      @update:model-value="handleModelChange"
    />
  </v-card>
</template>

<script setup>
const { modelType, modelUsage } = defineProps({
  modelType: { type: String, required: true },
  modelUsage: { type: String, required: true },
})

const modelStore = useModelStore()

const provider = ref()
const model = ref()

watch(
  () => modelStore.activeModels[modelType][modelUsage],
  (newActiveModel) => {
    if (newActiveModel && newActiveModel.source === 'free') {
      model.value = newActiveModel
      provider.value = newActiveModel.provider
    } else {
      model.value = null
      provider.value = null
    }
  },
  { immediate: true }
)

// 筛选 modelType 'chat' 'image' 'video'
const modelsByType = computed(() => modelStore.freeModels[modelType])
// // 合并相同服务商
const providers = computed(() => {
  if (modelsByType.value) {
    return [...new Set(modelsByType.value.map((model) => model.provider))]
  } else {
    return []
  }
})

// // 合并相同服务商的多种模型
const modelsByProvider = computed(() => {
  if (model.value) {
    return modelsByType.value.filter((model) => model.provider === provider.value)
  } else {
    return []
  }
})

function handleProviderChange() {
  model.value = modelsByProvider.value[0]
  handleModelChange()
}

function handleModelChange() {
  if (model.value) {
    model.value.source = 'free'
    modelStore.activeModels[modelType][modelUsage] = model.value
  }
}
</script>

<template>
  <v-card hover rounded="lg">
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
      hide-details="auto"
      density="comfortable"
      return-object
      @update:model-value="handleModelChange"
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

const provider = ref()
const model = ref()
const isSetModelDefault = ref(true)

watch(
  () => modelStore.activeModels[modelType][modelUsage],
  (newActiveModel) => {
    if (newActiveModel) {
      if (newActiveModel.source === 'free') {
        model.value = newActiveModel
        provider.value = newActiveModel.provider
      } else {
        model.value = null
        provider.value = null
      }
    } else {
      if (modelStore.activeModels[modelType]['default'].source === 'free') {
        model.value = modelStore.activeModels[modelType]['default']
        provider.value = modelStore.activeModels[modelType]['default'].provider
      } else {
        model.value = null
        provider.value = null
      }
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
  if (provider.value) {
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
    if (isSetModelDefault.value) {
      modelStore.activeModels[modelType]['default'] = model.value
      if (modelUsage !== 'default') modelStore.activeModels[modelType][modelUsage] = null
    } else {
      modelStore.activeModels[modelType][modelUsage] = model.value
    }
  }
}
</script>

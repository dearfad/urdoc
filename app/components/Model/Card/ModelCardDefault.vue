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
      item-value="id"
      variant="outlined"
      class="mt-4"
      hide-details="auto"
      density="comfortable"
      return-object
      @update:model-value="handleModelChange"
    />

    <v-card-actions>
      <v-spacer />
      <v-checkbox
        v-model="setModelThinking"
        max-width="70px"
        label="思考"
        density="compact"
        hide-details
        @update:model-value="handleModelThinking"
      />
      <v-checkbox
        v-model="setModelGlobal"
        max-width="70px"
        label="全局"
        density="compact"
        hide-details
        @update:model-value="handleModelChange"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
const { modelType, modelUsage } = defineProps({
  modelType: { type: String, required: true },
  modelUsage: { type: String, required: true },
})

const stateStore = useStateStore()
const modelStore = useModelStore()
const setModelGlobal = ref(false)
const setModelThinking = ref(false)

const provider = ref('')
const model = ref()

// 筛选 modelType 'chat' 'image' 'video'
const modelsByType = computed(() =>
  modelStore.defaultModels.filter((model) => model.type === modelType)
)
// 合并相同服务商
const providers = computed(() => [...new Set(modelsByType.value.map((model) => model.provider))])

// 合并相同服务商的多种模型
const modelsByProvider = computed(() =>
  modelsByType.value.filter((model) => model.provider === provider.value)
)

function handleProviderChange() {
  model.value = modelsByProvider.value[0]
  handleModelChange()
}

function handleModelChange() {
  // 设定模型全局应用
  let usages = []
  switch (modelType) {
    case 'chat':
      usages = setModelGlobal.value
        ? ['case', 'story', 'test', 'act', 'rate', 'face', 'pose', 'check', 'illustration']
        : [modelUsage]
      break
    case 'image':
      usages = setModelGlobal.value ? ['face', 'illustration'] : [modelUsage]
      break
    case 'video':
      usages = setModelGlobal.value ? ['pose'] : [modelUsage]
      break
    default:
      stateStore.appInfos.push('未知模型类型')
      return
  }
  for (const usage of usages) {
    if (model.value) {
      model.value.source = 'default'
      modelStore.activeModels[modelType][usage] = model.value
    }
  }
}

function handleModelThinking() {
  stateStore.isModelThinking = setModelThinking.value
}
</script>

<template>
  <v-card hover class="px-4 py-2" rounded="lg">
    <v-select
      v-model="provider"
      :items="providers"
      item-title="provider"
      label="服务商"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      @update:model-value="handleProviderChange"
    />
    <v-select
      v-model="model"
      :label="modelLabel"
      :items="modelsByProvider"
      item-title="model"
      variant="outlined"
      class="mt-4"
      hide-details="auto"
      density="comfortable"
      return-object
      @update:model-value="handleModelChange"
    />

    <v-card-actions>
      <v-btn text="管理" @click="isModelShow = !isModelShow" />
      <v-spacer />
      <v-checkbox
        v-model="setModelGlobal"
        max-width="70px"
        label="全局"
        density="compact"
        hide-details
        @update:model-value="handleModelChange"
      />
    </v-card-actions>

    <v-expand-transition>
      <v-card v-if="isModelShow" class="my-2 py-2 d-flex flex-column ga-2" variant="flat">
        {{ addModel }}
        <v-select
          v-model="defaultProvider"
          :items="modelStore.DEFAULT_PROVIDER_ID"
          item-title="name"
          variant="outlined"
          hide-details="auto"
          density="comfortable"
          label="选择服务商"
          return-object
          @update:model-value="selectProvider"
        />
        <v-text-field v-model="addModel.provider" variant="outlined" label="服务商" class="mt-4" />

        <v-text-field
          v-model="addModel.endpoint"
          variant="outlined"
          label="接口网址"
          hint="请填写接口网址, 例如'https://open.bigmodel.cn/api/paas/v4/chat/completions'"
        />
        <v-text-field
          v-model="addModel.model"
          variant="outlined"
          label="模型"
          hint="请填写模型id, 例如'glm-4-flash'"
        />
        <v-text-field
          v-model="addModel.apiKeyName"
          variant="outlined"
          label="API密钥名称"
          hint="请填写API密钥名称, 例如'ZHIPU_API_KEY'"
        />
        <v-text-field
          v-model="addModel.apiKey"
          variant="outlined"
          label="API密钥"
          hint="请填写API密钥, 密钥为本地浏览器保存"
        />
        <v-card-actions>
          <v-btn text="添加" @click="insertCustomModel" />
        </v-card-actions>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
const { modelType, modelUsage } = defineProps({
  modelType: { type: String, required: true },
  modelUsage: { type: String, required: true },
})
const modelLabel = computed(() => {
  return modelType === 'chat' ? '语言模型' : modelType === 'image' ? '图像模型' : '视频模型'
})

const stateStore = useStateStore()
const modelStore = useModelStore()
const setModelGlobal = ref(false)
const isModelShow = ref(false)
const defaultProvider = ref()

const provider = ref(modelStore.activeModels[modelType][modelUsage].provider)
const modelsByType = computed(() => modelStore.models.filter((model) => model.type === modelType))
const providers = computed(() => [...new Set(modelsByType.value.map((model) => model.provider))])
const model = ref(modelStore.activeModels[modelType][modelUsage].model)
const modelsByProvider = computed(() =>
  modelsByType.value.filter((model) => model.provider === provider.value)
)

function handleProviderChange() {
  model.value = modelsByProvider.value[0]
  handleModelChange()
}

const addModel = ref({
  provider: '',
  type: modelType,
  endpoint: '',
  model: '',
  apiKeyName: '',
  apiKey: '',
})

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
      stateStore.appInfo = '未知模型类型'
      return
  }
  for (const usage of usages) {
    modelStore.activeModels[modelType][usage] = model.value
  }
}

function insertCustomModel() {
  if (
    addModel.value.provider === '' ||
    addModel.value.type === '' ||
    addModel.value.endpoint === '' ||
    addModel.value.model === '' ||
    addModel.value.apiKeyName === '' ||
    addModel.value.apiKey === ''
  ) {
    stateStore.appInfos.push('请填写所有项目信息')
  } else {
    modelStore.customModels.push(JSON.parse(JSON.stringify(addModel.value)))
  }
}

function selectProvider() {
  addModel.value.provider = defaultProvider.value.name
  addModel.value.endpoint = modelStore.DEFAULT_ENDPOINT[defaultProvider.value.id][modelType]
}
</script>

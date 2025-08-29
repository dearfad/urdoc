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
      no-data-text="暂无可用服务商"
      @update:model-value="handleProviderChange"
    />
    <v-select
      v-model="model"
      label="模型"
      :items="modelsByProvider"
      item-title="model"
      variant="outlined"
      class="mt-4"
      hide-details="auto"
      density="comfortable"
      return-object
      no-data-text="暂无可用模型"
      @update:model-value="handleModelChange"
    />

    <v-card-actions>
      <v-btn text="管理" @click="isExpandShow = !isExpandShow" />
      <v-btn text="删除" @click="handleModelDelete" />
      <v-btn text="获取" @click="getCustomModels" />
      <v-btn text="上传" @click="uploadCustomModels" />
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
      <v-card v-if="isExpandShow" class="my-2 py-2 d-flex flex-column ga-2" variant="flat">
        <v-select
          v-model="predefinedProvider"
          :items="modelStore.DEFAULT_PROVIDER_ID"
          item-title="name"
          variant="outlined"
          hide-details="auto"
          density="comfortable"
          label="预设服务商"
          return-object
          @update:model-value="selectPredefinedProvider"
        />
        <v-text-field
          v-model="customModel.provider"
          variant="outlined"
          label="服务商"
          class="mt-4"
        />
        <v-text-field
          v-model="customModel.endpoint"
          variant="outlined"
          label="接口网址"
          hint="请填写接口网址, 例如'https://open.bigmodel.cn/api/paas/v4/chat/completions'"
        />
        <v-select
          v-model="customModel.apiKeyName"
          :items="Object.keys(apiKeyStore.apiKeys)"
          variant="outlined"
          hide-details="auto"
          density="comfortable"
          label="密钥"
          no-data-text="请先在设置中添加密钥"
        />
        <v-text-field
          v-model="customModel.model"
          variant="outlined"
          label="模型"
          hint="请填写模型id, 例如'glm-4-flash'"
        />
        <v-card-actions density="compact">
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
const stateStore = useStateStore()
const modelStore = useModelStore()
const apiKeyStore = useApiKeyStore()
const userStore = useUserStore()
const setModelGlobal = ref(false)
const isExpandShow = ref(false)

const provider = ref('')
const model = ref()
const predefinedProvider = ref('')

const modelsByType =
  modelStore.customModels.length > 0
    ? computed(() => modelStore.customModels.filter((model) => model.type === modelType))
    : computed(() => [])
const providers =
  modelsByType.value.length > 0
    ? computed(() => [...new Set(modelsByType.value.map((model) => model.provider))])
    : computed(() => [])
const modelsByProvider =
  modelsByType.value.length > 0
    ? computed(() => modelsByType.value.filter((model) => model.provider === provider.value))
    : computed(() => [])

const customModel = ref({
  provider: '',
  type: modelType,
  endpoint: '',
  model: '',
  apiKeyName: '',
})

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
      stateStore.appInfo = '未知模型类型'
      return
  }
  for (const usage of usages) {
    if (model.value) {
      model.value.source = 'custom'
      modelStore.activeModels[modelType][usage] = model.value
    }
  }
}

function insertCustomModel() {
  if (
    customModel.value.provider === '' ||
    customModel.value.type === '' ||
    customModel.value.endpoint === '' ||
    customModel.value.model === '' ||
    customModel.value.apiKeyName === ''
  ) {
    stateStore.appInfos.push('请填写所有项目信息')
  } else {
    // 检查是否已存在相同的provider和model组合
    const isDuplicate = modelStore.customModels.some(
      (model) =>
        model.provider === customModel.value.provider && model.model === customModel.value.model
    )
    if (isDuplicate) {
      stateStore.appInfos.push('已存在相同的模型，请勿重复添加')
    } else {
      const addModel = { ...customModel.value }
      modelStore.customModels.push(addModel)
      provider.value = customModel.value.provider
      handleProviderChange()
      isExpandShow.value = false
    }
  }
}

function handleModelDelete() {
  modelStore.customModels = modelStore.customModels.filter(
    (deleteModel) =>
      !(deleteModel.provider === model.value.provider && deleteModel.model === model.value.model)
  )
  if (providers.value.length > 0) {
    provider.value = providers.value[0]
    model.value = modelsByProvider.value[0]
    handleModelChange()
  } else {
    provider.value = ''
    model.value = null
  }
}

function selectPredefinedProvider() {
  customModel.value.provider = predefinedProvider.value.name
  customModel.value.endpoint = modelStore.DEFAULT_ENDPOINT[predefinedProvider.value.id][modelType]
}

async function getCustomModels() {
  if (userStore.isSignedIn) {
    await modelStore.database.selectAll()
  } else {
    stateStore.appInfos.push('请先登录')
  }
}

async function uploadCustomModels() {
  if (userStore.isSignedIn) {
    await modelStore.database.upsert()
  } else {
    stateStore.appInfos.push('请先登录')
  }
}
</script>

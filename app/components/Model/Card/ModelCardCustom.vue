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
      class="mt-4"
      hide-details="auto"
      density="comfortable"
      return-object
      @update:model-value="handleModelChange"
    />

    <v-card-actions class="px-0 ga-0">
      <v-btn text="添加" @click="isExpandShow = !isExpandShow" />
      <v-btn text="删除" @click="handleModelDelete" />
      <v-btn text="获取" @click="getCustomModels" />
      <v-btn text="上传" @click="uploadCustomModels" />
    </v-card-actions>
    <v-expand-transition>
      <v-card v-if="isExpandShow" class="my-2 py-2 d-flex flex-column ga-4" variant="flat">
        <v-select
          v-model="customModel.provider"
          :items="modelStore.PROVIDERS"
          item-title="name"
          item-value="id"
          variant="outlined"
          density="comfortable"
          label="预设服务商"
          hide-details="true"
        />
        <v-select
          v-model="customModel.thinking"
          :items="[
            { name: '否', id: false },
            { name: '是', id: true },
          ]"
          variant="outlined"
          label="思考模型"
          hide-details="true"
          item-title="name"
          item-value="id"
        />
        <v-text-field
          v-model="customModel.model"
          variant="outlined"
          label="模型"
          hide-details="true"
        />

        <v-card-actions density="compact">
          <v-spacer />
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
const userStore = useUserStore()
const isExpandShow = ref(false)

const provider = ref('')
const model = ref()

watch(
  () => modelStore.activeModels[modelType][modelUsage],
  (newActiveModel) => {
    if (newActiveModel && newActiveModel.source === 'custom') {
      model.value = newActiveModel
      provider.value = newActiveModel.provider
    } else {
      model.value = null
      provider.value = null
    }
  },
  { immediate: true }
)

const modelsByType =
  modelStore.customModels[modelType].length > 0
    ? computed(() => modelStore.customModels[modelType])
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
  model: '',
  thinking: false,
})

function handleProviderChange() {
  model.value = modelsByProvider.value[0]
  handleModelChange()
}

function handleModelChange() {
  if (model.value) {
    model.value.source = 'custom'
    modelStore.activeModels[modelType][modelUsage] = model.value
  }
}

function insertCustomModel() {
  if (customModel.value.provider === '' || customModel.value.model === '') {
    stateStore.appInfos.push('请填写所有项目信息')
  } else {
    // 检查是否已存在相同的provider和model组合
    const isDuplicate =
      modelStore.customModels.length > 0
        ? modelStore.customModels.some(
            (model) =>
              model.provider === customModel.value.provider &&
              model.model === customModel.value.model
          )
        : false
    if (isDuplicate) {
      stateStore.appInfos.push('已存在相同的模型，请勿重复添加')
    } else {
      modelStore.customModels[modelType].push(customModel.value)
      customModel.value.source = 'custom'
      modelStore.activeModels[modelType][modelUsage] = customModel.value
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

async function getCustomModels() {
  if (userStore.isSignedIn) {
    await modelStore.database.selectAll()
    provider.value = providers.value[0]
    handleProviderChange()
  } else {
    stateStore.appInfos.push('请先登录')
  }
}

async function uploadCustomModels() {
  if (userStore.isSignedIn) {
    await modelStore.database.upsert()
    provider.value = providers.value[0]
    handleProviderChange()
  } else {
    stateStore.appInfos.push('请先登录')
  }
}
</script>

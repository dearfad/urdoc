<template>
  <v-card hover class="px-4 py-2" rounded="lg">
    <v-select
      v-model="provider"
      :items="models"
      item-title="provider"
      label="服务商"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      return-object
    />
    {{ provider }}
    <!-- <v-select
      v-model="model"
      :label="modelLabel"
      :items="models"
      item-title="name"
      variant="outlined"
      class="mt-4"
      hide-details="auto"
      density="comfortable"
    /> -->
    <!-- <v-select
      v-model="category"
      label="类型"
      :items="categories"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      return-object
      @update:model-value="handleCategoryChange"
    />
    <v-select
      v-model="gateway"
      label="网关"
      :items="gateways"
      item-title="name"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      return-object
      @update:model-value="handleGatewayChange"
    />
    <v-select
      v-model="provider"
      label="服务商"
      :items="providers"
      item-title="name"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      return-object
      @update:model-value="handleProviderChange"
    />
    <v-select
      v-model="model"
      :label="modelLabel"
      :items="models"
      item-title="name"
      variant="outlined"
      class="mt-4"
      hide-details="auto"
      density="comfortable"
      return-object
      @update:model-value="handleModelChange"
    />
    <v-card-actions>
      <v-btn text="查看" @click="isModelShow = !isModelShow" />
      <v-spacer />
      <v-checkbox
        v-model="global"
        v-tooltip:bottom="'更改模型后生效'"
        max-width="70px"
        label="全局"
        density="compact"
        hide-details
        @update:model-value="handleModelChange"
      />
    </v-card-actions>
    <v-expand-transition>
      <v-card v-if="isModelShow" class="my-2 py-2 d-flex flex-column ga-2" variant="flat">
        <v-text-field
          v-model="customModel.gateway.id"
          variant="outlined"
          label="网关"
          hint="默认为直连，如有请填写，例如'OpenRouter'"
        />
        <v-text-field
          v-model="customModel.gateway.provider.id"
          variant="outlined"
          label="服务商"
          hint="例如'智谱', 'DeepSeek'"
        />
        <v-text-field
          v-model="customModel.gateway.provider.model.id"
          variant="outlined"
          label="模型"
          hint="请填写模型id, 例如'glm-4-flash'"
        />
        <v-text-field
          v-model="customUrl"
          variant="outlined"
          label="接口网址"
          hint="请填写接口网址, 例如'https://open.bigmodel.cn/api/paas/v4/chat/completions'"
        />
        <v-text-field
          v-model="customApiKeyName"
          variant="outlined"
          label="API密钥名称"
          hint="请填写API密钥名称, 例如'ZHIPU_API_KEY'"
        />
        <v-text-field
          v-model="customApiKey"
          variant="outlined"
          label="API密钥"
          hint="请填写API密钥, 密钥为本地浏览器保存"
        />
        <v-card-actions>
          <v-btn text="添加" @click="insertCustomModel" />
        </v-card-actions>
      </v-card>
    </v-expand-transition> -->
  </v-card>
</template>

<script setup>
const { modelType, modelUsage } = defineProps({
  modelType: { type: String, required: true },
  modelUsage: { type: String, required: true },
})
// const modelLabel = computed(() => {
//   return modelType === 'chat' ? '语言模型' : modelType === 'image' ? '图像模型' : '视频模型'
// })
const modelStore = useModelStore()
const provider = ref(modelStore.activeModels[modelType][modelUsage].provider)
const models = computed(() => modelStore.models.filter((model) => model.type === modelType))
// const stateStore = useStateStore()
// const apiKeyStore = useApiKeyStore()

// const global = ref(false)
// const isModelShow = ref(false)

// const customUrl = ref('')
// const customApiKeyName = ref('')
// const customApiKey = ref('')
// const customModel = ref({
//   gateway: {
//     name: '直连',
//     id: '直连',
//     url: '',
//     key: '',
//     apiKey: '',
//     provider: {
//       name: '',
//       id: '',
//       url: '',
//       key: '',
//       apiKey: '',
//       model: {
//         name: '',
//         id: '',
//       },
//     },
//   },
// })

// const categories = computed(() =>
//   modelStore.models['自定义']?.[modelType]?.gateways?.length > 0 ? ['默认', '自定义'] : ['默认']
// )

// const category = ref(
//   categories.value.find((g) => g.id === stateStore.models[modelType][modelUsage].category) ||
//     categories.value[0]
// )

// const gateways = computed(() => modelStore.models[category.value][modelType].gateways)
// const gateway = ref(
//   gateways.value.find((g) => g.id === stateStore.models[modelType][modelUsage].gateway) ||
//     gateways.value[0]
// )

// const providers = computed(() => {
//   return gateway.value.providers
// })
// const provider = ref(
//   providers.value.find((p) => p.id === stateStore.models[modelType][modelUsage].provider) ||
//     providers.value[0]
// )

// const models = computed(() => {
//   return provider.value.models
// })
// const model = ref(
//   models.value.find((m) => m.id === stateStore.models[modelType][modelUsage].id) || models.value[0]
// )

// function handleCategoryChange() {
//   gateway.value = gateways.value[0]
//   handleGatewayChange()
// }

// function handleGatewayChange() {
//   provider.value = providers.value[0]
//   handleProviderChange()
// }

// function handleProviderChange() {
//   model.value = models.value[0]
//   handleModelChange()
// }

// function handleModelChange() {
//   // 设定模型全局应用
//   let usages = []
//   switch (modelType) {
//     case 'chat':
//       usages = global.value
//         ? ['case', 'story', 'test', 'act', 'rate', 'face', 'pose', 'check', 'illustration']
//         : [modelUsage]
//       break
//     case 'image':
//       usages = global.value ? ['face', 'illustration'] : [modelUsage]
//       break
//     case 'video':
//       usages = global.value ? ['pose'] : [modelUsage]
//       break
//     default:
//       stateStore.appInfo = '未知模型类型'
//       return
//   }
//   for (const usage of usages) {
//     stateStore.models[modelType][usage] = {
//       category: category.value,
//       gateway: gateway.value.id,
//       provider: provider.value.id,
//       name: model.value.name,
//       id: model.value.id,
//       url: gateway.value.url ? gateway.value.url : provider.value.url,
//       key: {
//         gateway: gateway.value.key,
//         provider: provider.value.key,
//       },
//     }
//   }
// }

// function insertCustomModel() {
//   if (
//     customUrl.value === '' ||
//     customApiKeyName.value === '' ||
//     customApiKey.value === '' ||
//     customModel.value.gateway.id === '' ||
//     customModel.value.gateway.provider.id === '' ||
//     customModel.value.gateway.provider.model.id === ''
//   ) {
//     stateStore.appInfos.push('请填写所有项目信息')
//   } else {
//     if (customModel.value.gateway.id === '直连') {
//       customModel.value.gateway.provider.url = customUrl.value
//       customModel.value.gateway.provider.key = customApiKeyName.value
//     } else {
//       customModel.value.gateway.url = customUrl.value
//       customModel.value.gateway.key = customApiKeyName.value
//     }
//     modelStore.customModels[modelType].gateways.push(customModel.value)
//     apiKeyStore.apiKeys[customApiKeyName.value] = customApiKey.value
//   }
// }
</script>

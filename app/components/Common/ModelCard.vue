<template>
  <v-card hover class="px-4 py-2" rounded="lg">
    <v-tabs v-model="tab">
      <v-tab value="default">默认</v-tab>
      <v-tab value="custom">自定义</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="default">
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
          <div class="d-flex flex-column align-end mt-2">
            <v-checkbox
              v-model="global"
              v-tooltip:bottom="'更改模型后生效'"
              max-width="70px"
              label="全局"
              density="compact"
              hide-details
              @update:model-value="handleModelChange"
            />
          </div>
        </v-tabs-window-item>
        <v-tabs-window-item value="custom">
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
          <div class="d-flex flex-column align-end mt-2">
            <v-checkbox
              v-model="global"
              v-tooltip:bottom="'更改模型后生效'"
              max-width="70px"
              label="全局"
              density="compact"
              hide-details
              @update:model-value="handleModelChange"
            />
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
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

const modelStore = useModelStore()
const stateStore = useStateStore()
const global = ref(false)
const tab = ref('default')

const gateways = modelStore.models[modelType].gateways
const gateway = ref(
  gateways.find((g) => g.id === stateStore.models[modelType][modelUsage].gateway) || gateways[0]
)

const providers = computed(() => {
  return gateway.value.providers
})
const provider = ref(
  providers.value.find((p) => p.id === stateStore.models[modelType][modelUsage].provider) ||
    providers.value[0]
)

const models = computed(() => {
  return provider.value.models
})
const model = ref(
  models.value.find((m) => m.id === stateStore.models[modelType][modelUsage].id) || models.value[0]
)

function handleGatewayChange() {
  provider.value = providers.value[0]
  handleProviderChange()
}

function handleProviderChange() {
  model.value = models.value[0]
  handleModelChange()
}

function handleModelChange() {
  let usages = []
  switch (modelType) {
    case 'chat':
      usages = global.value
        ? ['case', 'story', 'test', 'act', 'rate', 'face', 'pose']
        : [modelUsage]
      break
    case 'image':
      usages = global.value ? ['face'] : [modelUsage]
      break
    case 'video':
      usages = global.value ? ['pose'] : [modelUsage]
      break
    default:
      stateStore.appInfo = '未知模型类型'
      return
  }
  for (const usage of usages) {
    stateStore.models[modelType][usage] = {
      gateway: gateway.value.id,
      provider: provider.value.id,
      name: model.value.name,
      id: model.value.id,
      url: gateway.value.url ? gateway.value.url : provider.value.url,
      key: {
        gateway: gateway.value.key,
        provider: provider.value.key,
      },
    }
  }
}
</script>

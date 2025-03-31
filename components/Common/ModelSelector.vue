<template>
  <v-sheet class="px-4 my-3" elevation="4" rounded="lg">
    <v-select
      v-model="gateway"
      label="聚合网关"
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
      label="模型"
      :items="models"
      item-title="name"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      return-object
      @update:model-value="handleModelChange"
    />
  </v-sheet>
</template>

<script setup>
const { modelsType } = defineProps({ modelsType: { type: String, required: true } })
const modelStore = useModelStore()
const stateStore = useStateStore()

const gateways = modelStore[modelsType].gateways
const gateway = ref(gateways[0])

const providers = computed(() => {
  return gateway.value.providers
})
const provider = ref(providers.value[0])

const models = computed(() => {
  return provider.value.models
})
const model = ref(models.value[0])

function handleGatewayChange() {
  provider.value = providers.value[0]
  handleProviderChange()
}

function handleProviderChange() {
  model.value = models.value[0]
  handleModelChange()
}

const modelTypeMap = {
  chatModels: 'chatModel',
  itvModels: 'itvModel',
  ttiModels: 'ttiModel',
}

function handleModelChange() {
  stateStore.models[modelTypeMap[modelsType]] = {
    gateway: gateway.value.id,
    provider: provider.value.id,
    name: model.value.name,
    id: model.value.id,
    url: gateway.value.url ? gateway.value.url : provider.value.url,
    envApiKeyName: gateway.value.envApiKeyName
      ? gateway.value.envApiKeyName
      : provider.value.envApiKeyName,
  }
}
</script>

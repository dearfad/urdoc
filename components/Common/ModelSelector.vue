<template>
  <v-sheet class="px-4 my-3" elevation="4" rounded="lg">
    <v-select
      v-model="selectedGateway"
      label="聚合网关"
      :items="gateways"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      @update:model-value="handleGatewayChange"
    />
    <v-select
      v-model="selectedProvider"
      label="服务商"
      :items="providers"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      @update:model-value="handleProviderChange"
    />
    <v-select
      v-model="selectedModel"
      label="模型"
      :items="models"
      item-title="name"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      return-object
    />
    <div>gateway: {{ selectedGateway }}</div>
    <div>provider: {{ selectedProvider }}</div>
    <div>model: {{ selectedModel.name }}</div>
  </v-sheet>
</template>

<script setup>
const modelStore = useModelStore()
const stateStore = useStateStore()

const gateways = modelStore.chatModels.gateways.map((gateway) => gateway.name)
const selectedGateway = ref(gateways[0])

const providers = computed(() => {
  return modelStore.chatModels.gateways
    .find((gateway) => gateway.name === selectedGateway.value)
    .providers.map((provider) => provider.name)
})
const selectedProvider = ref(providers.value[0])

const models = computed(() => {
  return modelStore.chatModels.gateways
    .find((gateway) => gateway.name === selectedGateway.value)
    .providers.find((provider) => provider.name === selectedProvider.value)
    .models.map((model) => model.name)
})

const selectedModel = ref(models.value[0])

// const gateways = computed(() => {
//   return [...Object.keys(modelStore.models)]
// })

// const providers = computed(() => {
//   return [...Object.keys(modelStore.models[stateStore.selectedGateway])]
// })

// const models = computed(() => {
//   return modelStore.models[stateStore.selectedGateway][stateStore.selectedProvider]
// })

function handleGatewayChange() {
  // stateStore.selectedProvider = providers.value[0]
  // handleProviderChange()
}

function handleProviderChange() {
  // stateStore.selectedModel = models.value[0]
}
</script>

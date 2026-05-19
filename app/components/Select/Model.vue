<template>
  <USelect v-model="selectedModel" :items="models" placeholder="选择预设模型..." variant="soft" size="lg" />
</template>

<script lang="ts" setup>
const { scene } = defineProps({
  scene: { type: String, required: true },
})

const modelStore = useModelStore()

const selectedModel = computed({
  get: () => {
    const active = modelStore.activeModels[scene]
    const index = modelStore.models.findIndex(
      m => m.provider === active.provider && m.name === active.name,
    )
    return String(index >= 0 ? index : 0)
  },
  set: (val: string) => {
    modelStore.activeModels[scene] = { ...modelStore.models[Number(val)] }
  },
})

const models = computed(() =>
  modelStore.models.map((model, index) => ({
    label: `${model.provider} - ${model.name}`,
    value: String(index),
    description: model.baseURL ?? undefined,
  })),
)
</script>

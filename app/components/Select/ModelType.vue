<template>
  <div class="flex flex-col gap-2">
    <USelect
      :model-value="selectedProvider"
      :items="providerOptions"
      placeholder="选择提供商..."
      variant="soft"
      size="lg"
      @update:model-value="onProvider"
    />
    <USelect
      :model-value="selectedModelName"
      :items="modelNameOptions"
      placeholder="选择模型..."
      variant="soft"
      size="lg"
      :disabled="!selectedProvider"
      @update:model-value="onModelName"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ type: string }>()

const modelStore = useModelStore()

const providerOptions = computed(() =>
  (modelStore.models[props.type] ?? []).map((g) => ({
    label: g.provider,
    value: g.provider,
  })),
)

const selectedProvider = computed(
  () => modelStore.activeModels[props.type]?.provider ?? undefined,
)

function onProvider(val: string | undefined) {
  if (!val) return
  const group = (modelStore.models[props.type] ?? []).find((g) => g.provider === val)
  if (!group) return
  modelStore.activeModels[props.type] = {
    provider: group.provider,
    name: group.models[0] ?? null,
    apiKey: group.apiKey,
    baseURL: group.baseURL,
  }
}

const modelNameOptions = computed(() => {
  const active = modelStore.activeModels[props.type]
  const group = (modelStore.models[props.type] ?? []).find((g) => g.provider === active?.provider)
  return group ? group.models.map((m) => ({ label: m, value: m })) : []
})

const selectedModelName = computed(
  () => modelStore.activeModels[props.type]?.name ?? undefined,
)

function onModelName(val: string | undefined) {
  if (!val) return
  const active = modelStore.activeModels[props.type]
  const provider = active?.provider
  if (!provider) return
  const group = (modelStore.models[props.type] ?? []).find((g) => g.provider === provider)
  if (!group) return
  modelStore.activeModels[props.type] = {
    provider: group.provider,
    name: val,
    apiKey: group.apiKey,
    baseURL: group.baseURL,
  }
}
</script>

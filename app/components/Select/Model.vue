<template>
  <div class="flex flex-col gap-2">
    <USelect v-model="selectedProvider" :items="providerOptions" placeholder="选择提供商..." variant="soft" size="lg" />
    <USelect
      v-model="selectedModelName"
      :items="modelNameOptions"
      placeholder="选择模型..."
      variant="soft"
      size="lg"
      :disabled="!selectedProvider"
    />
    <div class="flex items-center justify-between">
      <UCheckbox v-model="reasoning" label="思考模式" />
      <UButton
        icon="i-lucide-globe"
        size="sm"
        variant="soft"
        label="全局"
        @click="applyToAllScenes"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  scene: { type: String, required: true },
})

const modelStore = useModelStore()
const stateStore = useStateStore()

const sceneToModelType: Record<string, string> = {
  case: 'chat', story: 'chat', test: 'chat', act: 'chat', rate: 'chat',
  image: 'image', audio: 'audio', video: 'video',
}

const modelType = computed(() => sceneToModelType[props.scene] || props.scene)

const reasoning = computed({
  get: () => {
    const s = stateStore as Record<string, any>
    return s[props.scene]?.reasoning ?? false
  },
  set: (val: boolean) => {
    const s = stateStore as Record<string, any>
    if (s[props.scene]) s[props.scene].reasoning = val
  },
})

function applyToAllScenes() {
  useStateStore().toast.add({
    title: '提示',
    description: '聊天场景已共享同一模型配置，修改后全局生效',
    color: 'info',
    icon: 'i-lucide-info',
  })
}

const providerOptions = computed(() =>
  (modelStore.models[modelType.value] ?? []).map((g) => ({
    label: g.provider,
    value: g.provider,
  })),
)

const selectedProvider = computed({
  get: () => modelStore.activeModels[modelType.value]?.provider ?? undefined,
  set: (val: string | undefined) => {
    if (!val) return
    const group = (modelStore.models[modelType.value] ?? []).find((g) => g.provider === val)
    if (!group) return
    modelStore.activeModels[modelType.value] = {
      provider: group.provider,
      name: group.models[0] ?? null,
      apiKey: group.apiKey,
      baseURL: group.baseURL,
    }
  },
})

const modelNameOptions = computed(() => {
  const active = modelStore.activeModels[modelType.value]
  const group = (modelStore.models[modelType.value] ?? []).find((g) => g.provider === active?.provider)
  return group ? group.models.map((m) => ({ label: m, value: m })) : []
})

const selectedModelName = computed({
  get: () => modelStore.activeModels[modelType.value]?.name ?? undefined,
  set: (val: string | undefined) => {
    if (!val) return
    const active = modelStore.activeModels[modelType.value]
    const provider = active?.provider
    if (!provider) return
    const group = (modelStore.models[modelType.value] ?? []).find((g) => g.provider === provider)
    if (!group) return
    modelStore.activeModels[modelType.value] = {
      provider: group.provider,
      name: val,
      apiKey: group.apiKey,
      baseURL: group.baseURL,
    }
  },
})
</script>

<template>
  <v-card hover rounded="lg">
    <v-card-item v-if="isTitleShow" class="bg-surface-light">
      <v-card-title>模型设定</v-card-title>
    </v-card-item>
    <v-card-text>
      <template #prepend>
        <v-icon size="36" class="mx-0">{{ modelTypeIcon[modelType] }}</v-icon>
      </template>
      <template #title>{{ model.provider }}</template>
      <template #subtitle>
        {{ model.model }}
        <v-icon>{{ thinking }}</v-icon>
      </template>
      <template #append>
        <v-btn
          icon="mdi-chevron-down"
          class="mx-0 px-0"
          variant="flat"
          @click="isCardShow = !isCardShow"
        />
      </template>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        text="思考"
        :prepend-icon="stateStore.isModelThinking ? 'mdi-check-circle' : 'mdi-alert-circle'"
        @click="stateStore.isModelThinking = !stateStore.isModelThinking"
      />
      <v-btn text="设为全局" @click="handleModelGlobal" />
    </v-card-actions>
    <v-expand-transition>
      <div v-if="isCardShow">
        <v-divider />
        <v-tabs v-model="tab" grow density="compact">
          <v-tab value="free" text="免费" prepend-icon="mdi-check-circle-outline" />
          <v-tab value="custom" text="自定义" prepend-icon="mdi-pencil-outline" />
          <v-tab value="local" text="本地" prepend-icon="mdi-home" />
        </v-tabs>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="free">
            <ModelCardFree :model-type="modelType" :model-usage="modelUsage" />
          </v-tabs-window-item>
          <v-tabs-window-item value="custom">
            <ModelCardCustom :model-type="modelType" :model-usage="modelUsage" />
          </v-tabs-window-item>
          <v-tabs-window-item value="local">
            <ModelCardLocal :model-type="modelType" :model-usage="modelUsage" />
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
const { modelType, modelUsage, isTitleShow } = defineProps({
  modelType: { type: String, required: true },
  modelUsage: { type: String, required: true },
  isTitleShow: { type: Boolean, required: false, default: false },
})
const isCardShow = ref(false)
const tab = ref()
const stateStore = useStateStore()
const modelStore = useModelStore()
const model = computed(() => modelStore.activeModels[modelType][modelUsage])
const thinking = computed(() => (model.value.thinking ? 'mdi-brain' : ''))
const modelTypeIcon = ref({
  chat: 'mdi-message-text-outline',
  image: 'mdi-image-outline',
  video: 'mdi-video-outline',
})

onMounted(() => {
  // 模型全局应用
  tab.value = model.value.source
})
function handleModelGlobal() {
  // 设定模型全局应用
  let usages = []
  switch (modelType) {
    case 'chat':
      usages = [
        'case',
        'story',
        'test',
        'act',
        'rate',
        'face',
        'pose',
        'check',
        'illustration',
        'conversation',
        'discussion',
      ]
      break
    case 'image':
      usages = ['face', 'illustration']
      break
    case 'video':
      usages = ['pose']
      break
    default:
      stateStore.appInfos.push('未知模型类型')
      return
  }
  for (const usage of usages) {
    if (model.value) {
      modelStore.activeModels[modelType][usage] = model.value
    }
  }
}
</script>

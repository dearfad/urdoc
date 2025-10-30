<template>
  <v-card hover rounded="lg">
    <v-toolbar v-if="isTitleShow" density="comfortable">
      <template #prepend>
        <v-btn icon="mdi-medical-bag" variant="plain" />
      </template>
      <v-toolbar-title class="font-weight-bold ml-0" text="模型设定" />
    </v-toolbar>
    <v-expansion-panels variant="accordion">
      <v-expansion-panel v-for="(item, index) in models" :key="index">
        <v-expansion-panel-title>
          <v-icon :icon="item.icon" class="mx-2" />
          <span v-if="mdAndUp" class="font-weight-bold mx-2">{{ item.title }}</span>
          <span class="font-weight-bold mx-2">{{ modelUsageLabel[modelUsage] }}</span>
          <span class="mx-2">{{ item.model.model }}</span>
          <v-icon v-if="item.model.thinking" icon="mdi-brain" />
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-tabs v-model="tab" grow density="compact">
            <v-tab value="free" text="免费" prepend-icon="mdi-check-circle-outline" />
            <v-tab value="custom" text="自定义" prepend-icon="mdi-pencil-outline" />
            <v-tab value="local" text="本地" prepend-icon="mdi-home" />
          </v-tabs>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="free">
              <ModelCardFree :model-type="item.type" :model-usage="modelUsage" />
            </v-tabs-window-item>
            <v-tabs-window-item value="custom">
              <ModelCardCustom :model-type="item.type" :model-usage="modelUsage" />
            </v-tabs-window-item>
            <v-tabs-window-item value="local">
              <ModelCardLocal :model-type="item.type" :model-usage="modelUsage" />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- <v-card-actions>
      <v-spacer />
      <v-btn
        text="思考"
        :prepend-icon="stateStore.isModelThinking ? 'mdi-check-circle' : 'mdi-alert-circle'"
        @click="stateStore.isModelThinking = !stateStore.isModelThinking"
      />
      <v-btn text="设为全局" @click="handleModelGlobal" />
    </v-card-actions> -->
  </v-card>
</template>

<script setup>
import { useDisplay } from 'vuetify'
const { mdAndUp } = useDisplay()

const { modelType, modelUsage, isTitleShow } = defineProps({
  modelType: { type: String, required: false, default: 'all' },
  modelUsage: { type: String, required: false, default: 'default' },
  isTitleShow: { type: Boolean, required: false, default: true },
})
const modelUsageLabel = ref({
  default: '默认',
  case: '对话',
  story: '故事',
  test: '测试',
  act: '活动',
  rate: '评价',
  conversation: '对话',
  discussion: '讨论',
  check: '检查',
  face: '头像',
  illustration: '插图',
  pose: '姿势',
})

const tab = ref()
const modelStore = useModelStore()

const modelInfo = ref([
  {
    title: '文本',
    icon: 'mdi-text',
    type: 'chat',
    model:
      modelStore.activeModels['chat'][modelUsage] || modelStore.activeModels['chat']['default'],
  },
  {
    title: '图片',
    icon: 'mdi-image-outline',
    type: 'image',
    model:
      modelStore.activeModels['image'][modelUsage] || modelStore.activeModels['image']['default'],
  },
  {
    title: '视频',
    icon: 'mdi-video-outline',
    type: 'video',
    model:
      modelStore.activeModels['video'][modelUsage] || modelStore.activeModels['video']['default'],
  },
  {
    title: '音频',
    icon: 'mdi-account-tie-voice-outline',
    type: 'audio',
    model:
      modelStore.activeModels['audio'][modelUsage] || modelStore.activeModels['audio']['default'],
  },
])

const models = computed(() => {
  if (modelType === 'all') {
    return modelInfo.value
  } else {
    return modelInfo.value.filter((model) => model.type === modelType)
  }
})

// const stateStore = useStateStore()
// const model = computed(() => modelStore.activeModels[modelType][modelUsage])
// const thinking = computed(() => (model.value.thinking ? 'mdi-brain' : ''))

// onMounted(() => {
//   // 模型全局应用
//   tab.value = model.value.source
// })

// function handleModelGlobal() {
//   // 设定模型全局应用
//   let usages = []
//   switch (modelType) {
//     case 'chat':
//       usages = [
//         'case',
//         'story',
//         'test',
//         'act',
//         'rate',
//         'face',
//         'pose',
//         'check',
//         'illustration',
//         'conversation',
//         'discussion',
//       ]
//       break
//     case 'image':
//       usages = ['face', 'illustration']
//       break
//     case 'video':
//       usages = ['pose']
//       break
//     default:
//       stateStore.appInfos.push('未知模型类型')
//       return
//   }
//   for (const usage of usages) {
//     if (model.value) {
//       modelStore.activeModels[modelType][usage] = model.value
//     }
//   }
// }
</script>

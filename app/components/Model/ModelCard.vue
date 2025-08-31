<template>
  <v-card hover rounded="lg">
    <template #prepend>
      <v-icon size="48" class="mx-0"> mdi-brain</v-icon>
    </template>
    <template #title>{{ model.provider }}</template>
    <template #subtitle>{{ model.model }}</template>
    <template #append>
      <v-btn
        icon="mdi-chevron-down"
        class="mx-0 px-0"
        variant="flat"
        @click="isCardShow = !isCardShow"
      />
    </template>
    <v-expand-transition>
      <div v-if="isCardShow">
        <v-divider />
        <v-tabs v-model="tab" grow density="compact">
          <v-tab value="default" text="默认" prepend-icon="mdi-check-circle-outline" />
          <v-tab value="custom" text="自定义" prepend-icon="mdi-pencil-outline" />
        </v-tabs>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="default">
            <ModelCardDefault :model-type="modelType" :model-usage="modelUsage" />
          </v-tabs-window-item>
          <v-tabs-window-item value="custom">
            <ModelCardCustom :model-type="modelType" :model-usage="modelUsage" />
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
const { modelType, modelUsage } = defineProps({
  modelType: { type: String, required: true },
  modelUsage: { type: String, required: true },
})
const tab = ref('default')
const isCardShow = ref(false)
const modelStore = useModelStore()
const model = computed(() => modelStore.activeModels[modelType][modelUsage])
</script>

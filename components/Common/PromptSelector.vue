<template>
  <v-card hover class="px-4" rounded="lg">
    <v-select
      v-model="item"
      label="提示词"
      :items="items"
      item-title="title"
      variant="outlined"
      hide-details="auto"
      prepend-inner-icon="mdi-file-word-box-outline"
      density="comfortable"
      class="mt-4"
      return-object
      @update:model-value="handlePromptChange"
    />
    <v-card-actions>
      <v-spacer />
      <v-btn text="读取" @click="promptStore.getPrompts" />
      <v-btn text="编辑" @click="show = !show" />
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show" v-if="item">
        <v-text-field variant="outlined" label="标题" :model-value="item.title" />
        <v-textarea variant="outlined" label="内容" auto-grow :model-value="item.prompt" />
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
const show = ref(false)
const { modelType, modelUsage } = defineProps({
  modelType: { type: String, required: true },
  modelUsage: { type: String, required: true },
})
const promptStore = usePromptStore()
const item = ref(promptStore.prompts.system[modelUsage])
const items = computed(() => promptStore.prompts.user[modelUsage])
function handlePromptChange() {}
</script>

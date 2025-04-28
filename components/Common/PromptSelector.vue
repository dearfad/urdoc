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
      @update:model-value="handlePromptChange"
    />
    <v-card-actions>
      <v-spacer />
      <v-btn text="列表" @click="promptStore.getPrompts" />
      <v-btn text="编辑" @click="show = !show" />
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-divider />
        <v-textarea
          variant="outlined"
          auto-grow
          :model-value="promptStore.prompts.system[modelUsage].default"
        />
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
const item = ref()
const promptStore = usePromptStore()
const items = ref(promptStore.prompts.system[modelUsage].user)
function handlePromptChange() {}
</script>

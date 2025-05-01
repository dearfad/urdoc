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
      no-data-text="读取后可选择"
      @update:model-value="handlePromptChange"
    />
    <v-card-actions>
      <v-spacer />
      <v-btn text="读取" @click="promptStore.getPrompts" />
      <v-btn text="编辑" @click="show = !show" />
      <div v-if="item.id">
        <v-btn text="保存" @click="promptStore.insertPrompt" />
        <v-btn text="更新" @click="promptStore.updatePrompt" />
        <v-btn text="删除" @click="promptStore.deletePrompt" />
      </div>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show" v-if="item">
        <v-text-field variant="outlined" label="id" :model-value="item.id" />
        <v-text-field variant="outlined" label="标题" :model-value="item.title" />
        <v-textarea variant="outlined" label="内容" auto-grow :model-value="item.prompt" />
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
const show = ref(false)
const { usage } = defineProps({
  usage: { type: String, required: true },
})
const promptStore = usePromptStore()
const item = ref(promptStore.prompts.system[usage])
const items = computed(() => promptStore.prompts.user[usage])
function handlePromptChange() {}
</script>

<template>
  <v-card class="px-4 py-1" hover rounded="lg">
    <v-text-field
      v-model="tagInput"
      class="my-4"
      label="自定义设定"
      variant="outlined"
      hide-details="auto"
      clearable
      density="comfortable"
      placeholder="请用空格分隔多个关键词"
    />
  </v-card>
</template>

<script setup>
const { tagType } = defineProps({
  tagType: { type: String, required: true },
})
const stateStore = useStateStore()
const tagInput = ref(stateStore.tag[tagType].join(' '))
watch(tagInput, (newValue) => {
  stateStore.tag[tagType] = newValue.split(' ').filter(Boolean) // 使用 filter(Boolean) 去掉空字符串
})
</script>

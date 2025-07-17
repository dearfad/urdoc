<template>
  <v-sheet class="px-4" elevation="4" rounded="lg">
    <v-text-field
      v-model="tagInput"
      class="my-4"
      label="设定"
      variant="outlined"
      hide-details="auto"
      clearable
      density="comfortable"
      placeholder="多个要点请用空格隔开"
    />
  </v-sheet>
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

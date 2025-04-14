<template>
  <v-btn
    size="x-large"
    class="font-weight-bold my-5"
    elevation="4"
    rounded="lg"
    text="生成病例"
    :loading="isLoading"
    @click="generate"
  >
    <template #loader>
      <v-progress-circular indeterminate color="white" class="mr-4" />
      {{ stateStore.modelResponseField }}
    </template>
  </v-btn>
</template>

<script lang="ts" setup>
const { generateType } = defineProps({
  generateType: { type: String, required: true },
})
const stateStore = useStateStore()
const recordStore = useRecordStore()
const isLoading = ref(false)

async function generate() {
  recordStore.$reset()
  isLoading.value = true
  stateStore.isModelResponseStringShow = true
  switch (generateType) {
    case 'case':
      await recordStore.getCase()
      break
    case 'story':
      await recordStore.getStory()
      break
    case 'test':
      await recordStore.getTest()
      break
  }
  stateStore.isModelResponseStringShow = false
  isLoading.value = false
}
</script>

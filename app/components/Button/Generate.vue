<template>
  <UChatPromptSubmit :status="status" @click="submit()" streaming-color="success">
    {{ props.label }}
  </UChatPromptSubmit>
</template>

<script setup>
const props = defineProps({
  type: { type: String, required: true },
  task: { type: String, required: true },
  label: { type: String, required: true },
})

const stores = {
  case: useCaseStore(),
  story: useStoryStore(),
  test: useTestStore(),
  rate: useRateStore(),
  image: useImageStore(),
  speech: useSpeechStore(),
  video: useVideoStore(),
}

const targetStore = computed(() => stores[props.type])

const status = computed(() => targetStore.value.status ?? 'ready')

function submit() {
  targetStore.value[props.task]()
}
</script>

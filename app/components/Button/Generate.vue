<template>
  <UChatPromptSubmit
    :status="status"
    :disabled="disabled"
    @stop="stop()"
    @reload="reload()"
    @click="submit()"
    streaming-color="success"
  >
    {{ label }}
  </UChatPromptSubmit>
</template>

<script setup>
const props = defineProps({
  type: { type: String, required: true },
  task: { type: String, required: true },
})

const LABELS = {
  case: { generate: '生成病例', verify: '验证病例' },
  story: { generate: '生成故事', verify: '验证故事' },
  test: { generate: '生成考核', verify: '验证考核' },
  rate: { generate: '生成评估', verify: '验证评估' },
  image: { generate: '生成图像', verify: '验证图像' },
}

const label = computed(() => LABELS[props.type]?.[props.task] ?? '生成')

const recordStore = useRecordStore()
const targetStore = computed(() => recordStore[props.type])

const status = computed(() => targetStore.value.status ?? 'idle')
const disabled = computed(() => {
  if (props.type === 'case') return false
  if (!recordStore.case) return true
  return !recordStore.case.case?.content?.length
})

function submit() {
  targetStore.value.generate()
}

function stop() {
  targetStore.value.stop?.()
}

function reload() {
  targetStore.value.generate()
}
</script>

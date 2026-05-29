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
const {
  label,
  status,
  disabled,
  submit,
  stop,
  reload,
} = useChatGeneration(props.type, props.task)
</script>

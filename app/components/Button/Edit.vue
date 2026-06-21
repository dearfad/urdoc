<template>
  <UButton
    :icon="modelValue ? 'i-lucide-x' : 'i-lucide-pencil'"
    :disabled="disabled"
    variant="ghost"
    @click="$emit('update:modelValue', !modelValue)"
  >
    {{ label }}
  </UButton>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: undefined },
})
defineEmits(['update:modelValue'])
</script>

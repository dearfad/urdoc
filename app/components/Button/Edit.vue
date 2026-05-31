<template>
  <UButton
    :icon="modelValue ? 'i-lucide-x' : 'i-lucide-pencil'"
    :disabled="disabled"
    :color="disabled ? 'error' : undefined"
    variant="ghost"
    @click="$emit('update:modelValue', !modelValue)"
  />
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

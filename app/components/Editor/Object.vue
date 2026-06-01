<template>
  <div class="flex flex-col gap-2" :class="{ 'ps-4': depth > 0 }">
    <div
      v-for="(value, key) in modelValue"
      :key="key"
      class="flex items-start gap-2"
    >
      <span class="mt-2 w-32 shrink-0 truncate text-sm font-medium text-muted">
        {{ formatKey(key) }}
      </span>
      <div class="flex-1">
        <UInput
          v-if="getValueType(value) === 'string'"
          :value="value"
          @update:modelValue="(val) => updateValue(key, val)"
          class="w-full"
        />
        <UTextarea
          v-else-if="getValueType(value) === 'longtext'"
          :value="value"
          @update:modelValue="(val) => updateValue(key, val)"
          class="w-full"
          :rows="3"
          autoresize
        />
        <UInput
          v-else-if="getValueType(value) === 'number'"
          :value="value"
          type="number"
          @update:modelValue="(val) => updateValue(key, Number(val))"
          class="w-full"
        />
        <USwitch
          v-else-if="getValueType(value) === 'boolean'"
          :value="value"
          @update:modelValue="(val) => updateValue(key, val)"
        />
        <UInputTags
          v-else-if="getValueType(value) === 'string[]'"
          :value="value"
          @update:modelValue="(val) => updateValue(key, val)"
          class="w-full"
        />
        <EditorObject
          v-else-if="getValueType(value) === 'object'"
          :modelValue="value"
          @update:modelValue="(val) => updateValue(key, val)"
          :depth="depth + 1"
        />
        <UInput
          v-else
          :value="String(value ?? '')"
          @update:modelValue="(val) => updateValue(key, val)"
          placeholder="null"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  depth: { type: Number, default: 0 },
})
const emit = defineEmits(['update:modelValue'])

function updateValue(key, val) {
  emit('update:modelValue', { ...props.modelValue, [key]: val })
}

function getValueType(value) {
  if (value === null || value === undefined) return 'null'
  if (Array.isArray(value)) {
    if (value.length === 0 || value.every((v) => typeof v === 'string')) return 'string[]'
    return 'json'
  }
  const type = typeof value
  if (type === 'object') return 'object'
  if (type === 'boolean') return 'boolean'
  if (type === 'number') return 'number'
  if (type === 'string') return value.length > 60 ? 'longtext' : 'string'
  return 'string'
}

function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}
</script>

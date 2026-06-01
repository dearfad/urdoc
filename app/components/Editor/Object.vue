<template>
  <div class="flex flex-col gap-3" :class="{ 'ps-4': depth > 0 }">
    <div
      v-for="(value, key) in modelValue"
      :key="key"
      class="flex flex-col gap-1.5 rounded-lg border border-default bg-elevated/50 p-3 sm:flex-row sm:items-start sm:gap-3"
    >
      <span
        class="flex shrink-0 items-center text-sm font-semibold text-muted sm:mt-1.5 sm:w-20 sm:text-base"
      >
        {{ formatKey(key) }}
      </span>
      <div class="min-w-0 flex-1">
        <UInput
          v-if="getValueType(value) === 'string'"
          :value="value"
          @update:modelValue="(val) => updateValue(key, val)"
          class="w-full"
          size="xl"
          variant="soft"
          :ui="{ base: 'text-sm sm:text-base' }"
        />
        <UTextarea
          v-else-if="getValueType(value) === 'longtext'"
          :value="value"
          @update:modelValue="(val) => updateValue(key, val)"
          class="w-full"
          :rows="3"
          autoresize
          size="xl"
          variant="soft"
          :ui="{ base: 'text-sm sm:text-base' }"
        />
        <UInput
          v-else-if="getValueType(value) === 'number'"
          :value="value"
          type="number"
          @update:modelValue="(val) => updateValue(key, Number(val))"
          class="w-full"
          size="xl"
          variant="soft"
          :ui="{ base: 'text-sm sm:text-base' }"
        />
        <USwitch
          v-else-if="getValueType(value) === 'boolean'"
          :value="value"
          @update:modelValue="(val) => updateValue(key, val)"
          size="lg"
        />
        <UInputTags
          v-else-if="getValueType(value) === 'string[]'"
          :value="value"
          @update:modelValue="(val) => updateValue(key, val)"
          class="w-full"
          size="xl"
          variant="soft"
          :ui="{ input: 'text-sm sm:text-base' }"
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
          size="xl"
          variant="soft"
          :ui="{ base: 'text-sm sm:text-base' }"
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

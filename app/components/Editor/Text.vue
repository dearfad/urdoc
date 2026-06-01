<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="flex gap-1 border-b border-default bg-elevated p-1">
      <UButton
        icon="i-lucide-type"
        size="sm"
        variant="soft"
        :color="currentMode === 'plain' ? 'primary' : 'neutral'"
        @click="currentMode = 'plain'"
      />
      <UButton
        icon="i-lucide-file-text"
        size="sm"
        variant="soft"
        :color="currentMode === 'markdown' ? 'primary' : 'neutral'"
        @click="currentMode = 'markdown'"
      />
      <UButton
        icon="i-lucide-pencil"
        size="sm"
        variant="soft"
        :color="currentMode === 'rich' ? 'primary' : 'neutral'"
        @click="currentMode = 'rich'"
      />
    </div>
    <ClientOnly>
      <UEditor
        :key="currentMode"
        v-slot="{ editor }"
        v-model="content"
        :content-type="currentMode === 'rich' ? 'html' : 'markdown'"
        class="min-h-0 flex-1"
      >
        <UEditorToolbar v-if="currentMode !== 'plain'" layout="fixed" :editor="editor" />
      </UEditor>
    </ClientOnly>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  mode: { type: String, default: 'markdown' },
})
const emit = defineEmits(['update:modelValue'])

const currentMode = ref(props.mode)

watch(
  () => props.mode,
  (val) => {
    currentMode.value = val
  },
)

const content = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

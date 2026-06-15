<template>
  <div class="flex flex-1 flex-col gap-2 min-h-0">
    <USelect
      v-model="selectedTask"
      :items="taskOptions"
      placeholder="选择任务..."
      variant="soft"
      size="lg"
      :disabled="taskOptions.length === 0"
    />
    <template v-if="loading">
      <div class="text-muted flex items-center justify-center p-8 text-sm">
        <UIcon name="i-lucide-loader" class="mr-2 animate-spin" />
        加载提示词...
      </div>
    </template>
    <div v-else-if="promptContent !== null" class="flex min-h-0 flex-1 flex-col">
      <div class="flex gap-1 border-b border-default bg-elevated p-1">
        <UButton
          icon="i-lucide-file-text"
          size="sm"
          variant="soft"
          :color="mode === 'rich' ? 'primary' : 'neutral'"
          @click="mode = 'rich'"
        />
        <UButton
          icon="i-lucide-code"
          size="sm"
          variant="soft"
          :color="mode === 'raw' ? 'primary' : 'neutral'"
          @click="mode = 'raw'"
        />
        <div class="flex-1" />
        <template v-if="isCustom">
          <div class="flex items-center gap-1.5">
            <div class="h-1.5 w-1.5 rounded-full bg-warning" />
            <span class="text-xs font-medium text-warning">已自定义</span>
          </div>
          <UButton icon="i-lucide-rotate-ccw" variant="ghost" size="xs" color="warning" @click="handleReset" />
        </template>
      </div>
      <template v-if="mode === 'rich'">
        <ClientOnly>
          <UEditor
            v-model="promptContent"
            content-type="markdown"
            class="min-h-0 flex-1 w-full"
            :ui="{ base: 'sm:px-0' }"
          />
          <template #fallback>
            <UTextarea
              v-model="promptContent"
              variant="soft"
              size="lg"
              class="font-mono"
            />
          </template>
        </ClientOnly>
      </template>
      <UTextarea
        v-else
        v-model="promptContent"
        variant="soft"
        size="lg"
        autoresize
        :maxrows="0"
        class="font-mono min-h-0 w-full rounded-none"
      />
    </div>
    <div v-else class="text-muted flex items-center justify-center p-8 text-sm">
      无系统提示词
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAvailablePrompts, getPrompt } from '~/utils/prompts'

const props = defineProps({
  scene: { type: String, required: true },
})

const promptStore = usePromptStore()

const taskLabels: Record<string, string> = {
  generate: '生成',
  verify: '校验',
  fix: '修正',
  prompt: '提示词',
}

const availablePrompts = getAvailablePrompts()
const tasks = computed(() => availablePrompts[props.scene] ?? [])
const taskOptions = computed(() => tasks.value.map((t) => ({ label: taskLabels[t] ?? t, value: t })))

const selectedTask = ref(tasks.value[0] ?? '')
const promptContent = ref<string | null>(null)
const systemContent = ref<string | null>(null)
const loading = ref(false)
const mode = ref<'rich' | 'raw'>('rich')

const isCustom = computed(() => {
  if (!selectedTask.value) return false
  return promptStore.isCustom(props.scene, selectedTask.value)
})

watch(
  selectedTask,
  async (task) => {
    if (!task) {
      promptContent.value = null
      systemContent.value = null
      return
    }
    loading.value = true
    const sys = (await getPrompt(props.scene, task)) || ''
    systemContent.value = sys
    const key = `${props.scene}/${task}`
    promptContent.value = promptStore.customPrompts[key] ?? sys
    loading.value = false
  },
  { immediate: true },
)

watch(
  promptContent,
  (val) => {
    if (loading.value || !val || !selectedTask.value) return
    const sys = systemContent.value ?? ''
    if (val !== sys) {
      promptStore.setPrompt(props.scene, selectedTask.value, val)
    } else if (promptStore.isCustom(props.scene, selectedTask.value)) {
      promptStore.resetPrompt(props.scene, selectedTask.value)
    }
  },
)

function handleReset() {
  promptStore.resetPrompt(props.scene, selectedTask.value)
  promptContent.value = systemContent.value
}
</script>
<template>
  <div class="flex flex-col gap-2 p-2">
    <UInputTags
      v-model="customTags"
      icon="i-lucide-tag"
      size="xl"
      variant="soft"
      placeholder="输入按回车键确认或添加..."
    />
    <div class="grid grid-cols-[1fr_auto] gap-2">
      <USelect v-model="selectedItems" :items="customItems" multiple class="min-w-0" variant="soft">
        <template #item-trailing="{ item }">
          <UIcon
            v-if="typeof item === 'string' && customTags.includes(item)"
            name="i-lucide-check-circle"
            class="text-green-500 size-4"
          />
        </template>
      </USelect>
      <UButton @click="addSelectedItems" variant="subtle">添加</UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  scene: { type: String, required: true },
})

const stateStore = useStateStore()
const selectedItems = ref<string[]>([])

const sceneState = computed(() => {
  const s = props.scene as 'case' | 'story' | 'act' | 'rate' | 'test'
  return stateStore[s] as unknown as { custom: string[] }
})

const customTags = computed({
  get: () => sceneState.value.custom,
  set: (val) => { sceneState.value.custom = val },
})

const customItems = computed(() => getCustomItems(props.scene))

function addSelectedItems() {
  selectedItems.value.forEach((item) => {
    if (!customTags.value.includes(item)) {
      customTags.value.push(item)
    }
  })
  selectedItems.value = []
}
</script>

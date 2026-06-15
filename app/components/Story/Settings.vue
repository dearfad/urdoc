<template>
  <UCard
    id="component-story-settings"
    :ui="{
      header: 'bg-elevated flex items-center py-2',
      body: 'p-0 sm:p-0 flex flex-col',
      root: 'border border-default overflow-auto',
    }"
  >
    <template #header v-if="isTitleShow">
      <UIcon name="i-lucide-cog" class="mr-2" />
      <span class="font-bold">故事设定</span>
      <UButton
        :icon="collapsed ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
        variant="ghost"
        size="sm"
        class="ms-auto"
        @click="collapsed = !collapsed"
      />
    </template>
    <template #default>
      <UTabs v-show="!collapsed" :items="tabItems" variant="link" class="w-full flex flex-col min-h-0" :ui="{ trigger: 'grow', content: 'flex-1 min-h-0 overflow-auto' }" defaultValue="custom">
        <template #custom>
          <SelectCustom scene="story" />
        </template>
        <template #model>
          <div class="m-4 flex flex-col">
            <SelectModel scene="story" />
          </div>
        </template>
        <template #prompt>
          <div class="m-4 flex flex-1 flex-col min-h-0">
            <SelectPrompt scene="story" />
          </div>
        </template>
      </UTabs>
    </template>
  </UCard>
</template>

<script setup>
const collapsed = ref(false)

const tabItems = [
  {
    label: '自定义',
    value: 'custom',
    icon: 'i-lucide-pencil',
    slot: 'custom',
  },
  {
    label: '提示词',
    value: 'prompt',
    icon: 'i-lucide-file-text',
    slot: 'prompt',
  },
  {
    label: '模型',
    value: 'model',
    icon: 'i-lucide-cpu',
    slot: 'model',
  },
]

const { isTitleShow } = defineProps({
  isTitleShow: { type: Boolean, required: false, default: true },
})
</script>

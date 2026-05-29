<template>
  <UCard
    id="component-rate-settings"
    :ui="{
      header: 'bg-elevated flex items-center py-2',
      body: 'p-0 sm:p-0 flex flex-col',
      root: 'border border-default overflow-auto',
    }"
  >
    <template #header v-if="isTitleShow">
      <UIcon name="i-lucide-cog" class="mr-2" />
      <span class="font-bold">评估设定</span>
    </template>
    <template #default>
      <UTabs :items="tabItems" variant="link" class="w-full" :ui="{ trigger: 'grow' }" defaultValue="custom">
        <template #custom>
          <div class="flex flex-col gap-2 p-2">
            <UInputTags
              v-model="stateStore.rate.custom"
              icon="i-lucide-tag"
              size="xl"
              variant="soft"
              placeholder="输入按回车键确认或添加..."
            />
            <div class="flex flex-row">
              <USelect v-model="selectedCustomItems" :items="customItems" multiple class="flex-1" variant="soft" />
              <UButton @click="updateCustomItems" variant="subtle" class="ml-2">添加</UButton>
            </div>
          </div>
        </template>
        <template #model>
          <div class="m-4 flex flex-col">
            <SelectModel scene="rate" />
          </div>
        </template>
      </UTabs>
    </template>
  </UCard>
</template>

<script setup>
const stateStore = useStateStore()

const tabItems = [
  {
    label: '自定义',
    value: 'custom',
    icon: 'i-lucide-pencil',
    slot: 'custom',
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

const selectedCustomItems = ref([])
const customItems = ref([
  {
    type: 'label',
    label: '评估维度',
  },
  '临床思维',
  '诊断能力',
  '治疗方案',
  '沟通能力',
  {
    type: 'separator',
  },
  {
    type: 'label',
    label: '评估标准',
  },
  '完整性',
  '准确性',
  '规范性',
])
function updateCustomItems() {
  selectedCustomItems.value.forEach((customItem) => {
    if (!stateStore.rate.custom.includes(customItem)) {
      stateStore.rate.custom.push(customItem)
    }
  })
  selectedCustomItems.value = []
}
</script>

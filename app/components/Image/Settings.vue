<template>
  <UCard
    id="component-image-settings"
    :ui="{
      header: 'bg-elevated flex items-center py-2',
      body: 'p-0 sm:p-0 flex flex-col',
      root: 'border border-default overflow-auto',
    }"
  >
    <template #header v-if="isTitleShow">
      <UIcon name="i-lucide-cog" class="mr-2" />
      <span class="font-bold">图像设定</span>
    </template>
    <template #default>
      <div class="m-4 flex flex-col">
        <SelectModel scene="image" />
      </div>
    </template>
  </UCard>
</template>

<script setup>
defineProps({
  isTitleShow: { type: Boolean, required: false, default: true },
})
</script>

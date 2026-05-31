<template>
  <UCard
    id="component-image-index"
    :ui="{
      root: 'border border-default overflow-auto flex flex-col',
      header: 'bg-elevated flex items-center py-2 ',
      body: 'py-0 sm:py-2 flex-1',
      footer: 'p-0 sm:p-0',
    }"
  >
    <template #header>
      <UButton icon="i-lucide-image" variant="ghost" to="/multimodal/image" />
      <span class="font-bold">图像创作</span>
      <div class="ms-auto flex gap-2">
        <ButtonGenerate type="image" task="generate" label="生成图像" />
      </div>
    </template>
    <template #default> </template>
    <template #footer> </template>
  </UCard>
</template>

<script setup></script>

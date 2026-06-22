<template>
  <div class="flex items-center gap-2">
    <div class="flex items-center gap-0 md:hidden">
      <UButton
        icon="i-lucide-file-plus-2"
        variant="ghost"
        size="sm"
        :loading="isGenerating"
        @click="$emit('generate')"
      />
      <UButton
        icon="i-lucide-settings"
        variant="ghost"
        size="sm"
        @click="$emit('toggleSettings')"
      />
    </div>
    <UPopover
      v-model:open="isMenuOpen"
      :dismissible="true"
      class="md:hidden"
      :ui="{ content: 'bg-default shadow-2xl rounded-xl ring border border-default' }"
    >
      <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" size="sm" />
      <template #content>
        <div class="flex flex-col gap-1 p-1" @click="isMenuOpen = false">
          <UButton
            icon="i-lucide-check-circle"
            variant="ghost"
            :disabled="!hasContent"
            @click="$emit('verify')"
          >
            校验
          </UButton>
          <ButtonCapture :capture-id="captureId" label="截屏" />
          <ButtonClipboard :text="markdown" label="复制" />
          <ButtonAudio :text="markdown" label="朗读" />
          <ButtonEdit v-model="editing" :disabled="!hasContent" label="编辑" />
        </div>
      </template>
    </UPopover>
    <div class="hidden items-center gap-2 md:flex">
      <UTooltip text="生成">
        <UButton
          icon="i-lucide-file-plus-2"
          variant="ghost"
          :loading="isGenerating"
          @click="$emit('generate')"
        />
      </UTooltip>
      <UTooltip text="设定">
        <UButton
          icon="i-lucide-settings"
          variant="ghost"
          @click="$emit('toggleSettings')"
        />
      </UTooltip>
      <UTooltip text="校验">
        <UButton
          icon="i-lucide-check-circle"
          variant="ghost"
          :disabled="!hasContent"
          @click="$emit('verify')"
        />
      </UTooltip>
      <UTooltip text="截屏">
        <ButtonCapture :capture-id="captureId" />
      </UTooltip>
      <UTooltip text="复制">
        <ButtonClipboard :text="markdown" />
      </UTooltip>
      <UTooltip text="朗读">
        <ButtonAudio :text="markdown" />
      </UTooltip>
      <UTooltip text="编辑">
        <ButtonEdit v-model="editing" :disabled="!hasContent" />
      </UTooltip>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isGenerating: { type: Boolean, required: true },
  hasContent: { type: Boolean, required: true },
  markdown: { type: String, default: '' },
  captureId: { type: String, required: true },
})
const editing = defineModel('editing', { type: Boolean, default: false })

defineEmits(['generate', 'toggleSettings', 'verify'])

const isMenuOpen = ref(false)
</script>

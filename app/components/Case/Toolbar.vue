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
            {{ t('common.verify') }}
          </UButton>
          <ButtonCapture :capture-id="captureId" :label="t('common.capture')" />
          <ButtonClipboard :text="markdown" :label="t('common.copy')" />
          <ButtonAudio :text="markdown" :label="t('common.readAloud')" />
          <ButtonEdit v-model="editing" :disabled="!hasContent" :label="t('common.edit')" />
        </div>
      </template>
    </UPopover>
    <div class="hidden items-center gap-2 md:flex">
      <UTooltip :text="t('common.generate')">
        <UButton
          icon="i-lucide-file-plus-2"
          variant="ghost"
          :loading="isGenerating"
          @click="$emit('generate')"
        />
      </UTooltip>
      <UTooltip :text="t('common.settings')">
        <UButton
          icon="i-lucide-settings"
          variant="ghost"
          @click="$emit('toggleSettings')"
        />
      </UTooltip>
      <UTooltip :text="t('common.verify')">
        <UButton
          icon="i-lucide-check-circle"
          variant="ghost"
          :disabled="!hasContent"
          @click="$emit('verify')"
        />
      </UTooltip>
      <UTooltip :text="t('common.capture')">
        <ButtonCapture :capture-id="captureId" />
      </UTooltip>
      <UTooltip :text="t('common.copy')">
        <ButtonClipboard :text="markdown" />
      </UTooltip>
      <UTooltip :text="t('common.readAloud')">
        <ButtonAudio :text="markdown" />
      </UTooltip>
      <UTooltip :text="t('common.edit')">
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

const { t } = useI18n()

const isMenuOpen = ref(false)
</script>

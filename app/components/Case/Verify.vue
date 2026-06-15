<template>
  <UCard
    :ui="{
      root: 'border border-default',
      header: 'bg-elevated flex items-center py-2',
      body: 'py-2 sm:py-2',
      footer: 'p-2 sm:p-2',
    }"
  >
    <template #header>
      <UIcon name="i-lucide-check-circle" class="mr-2" />
      <span class="font-bold">校验结果</span>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        size="sm"
        class="ms-auto"
        @click="$emit('close')"
      />
    </template>
    <template #default>
      <ClientOnly>
        <UChatReasoning
          v-if="caseStore.verifyReasoning"
          :text="caseStore.verifyReasoning"
          defaultOpen
          :ui="{ body: 'max-h-none pt-2' }"
          class="pt-2"
        >
          <Comark
            :markdown="caseStore.verifyReasoning"
            class="*:first:mt-0 *:last:mb-0"
          />
        </UChatReasoning>
        <Comark
          v-if="caseStore.verifyResult"
          :markdown="caseStore.verifyResult"
        />
        <p
          v-else
          class="text-muted py-4 text-center"
        >
          点击「校验」按钮开始校验病例...
        </p>
        <UChatReasoning
          v-if="caseStore.fixReasoning"
          :text="caseStore.fixReasoning"
          defaultOpen
          :ui="{ body: 'max-h-none pt-2' }"
          class="pt-2"
        >
          <Comark
            :markdown="caseStore.fixReasoning"
            class="*:first:mt-0 *:last:mb-0"
          />
        </UChatReasoning>
      </ClientOnly>
    </template>
    <template #footer>
      <div
        v-if="caseStore.verifyResult"
        class="flex items-center justify-end gap-2"
      >
        <UButton
          icon="i-lucide-wand-sparkles"
          :loading="caseStore.currentType === 'case-fix'"
          :disabled="isVerifyPassed || caseStore.currentType === 'case-fix'"
          @click="caseStore.fix()"
        >
          自动更改
        </UButton>
        <UButton
          icon="i-lucide-pencil"
          variant="soft"
          @click="$emit('edit')"
        >
          手动更正
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup>
const caseStore = useCaseStore()
defineEmits(['close', 'edit'])

const isVerifyPassed = computed(() => {
  if (!caseStore.verifyResult) return false
  const lines = caseStore.verifyResult.split('\n')
  const idx = lines.findIndex(l => l.trim() === '## 校验结论')
  if (idx === -1) return false
  for (let i = idx + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line) return line === '通过'
  }
  return false
})
</script>

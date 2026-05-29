<template>
  <UCard
    id="component-test-index"
    :ui="{
      root: 'border border-default overflow-auto flex flex-col',
      header: 'bg-elevated flex items-center py-2 ',
      body: 'py-0 sm:py-2 flex-1',
      footer: 'p-0 sm:p-0',
    }"
  >
    <template #header>
      <UButton icon="i-mdi-alpha-t-circle" variant="ghost" to="/cstar/test" />
      <span class="font-bold">考核理论</span>
      <div class="ms-auto flex gap-2">
        <ButtonCapture capture-id="component-test-index" />
        <UButton icon="i-lucide-file-volume" variant="ghost" />
        <ButtonGenerate type="test" task="generate" />
      </div>
    </template>

    <template #default>
      <ClientOnly>
        <UChatReasoning
          v-if="stateStore.test.isReasoning"
          :text="testStore.test.reasoning"
          defaultOpen
          :ui="{ body: 'max-h-none pt-2' }"
          class="pt-2"
        >
          <Comark :markdown="testStore.test.reasoning" class="*:first:mt-0 *:last:mb-0" />
        </UChatReasoning>
        <Comark :markdown="content" />
      </ClientOnly>
    </template>

    <template #footer>
      <div class="mx-4 my-2 flex flex-wrap gap-2" v-if="testStore.test.custom && testStore.test.custom.length > 0">
        <UBadge
          v-for="custom in testStore.test.custom"
          :key="custom"
          variant="soft"
          color="neutral"
          size="lg"
          icon="i-lucide-pencil"
        >
          {{ custom }}
        </UBadge>
      </div>
    </template>
  </UCard>
</template>

<script setup>
import { parse } from 'partial-json'
const testStore = useTestStore()
const stateStore = useStateStore()
const content = computed(() => {
  if (!testStore.test?.content) return ''
  if (typeof testStore.test.content === 'string') return testStore.test.content
  const raw = JSON.stringify(testStore.test.content)
  const parsed = parse(raw)
  return Object.entries(parsed)
    .map(([key, value]) => {
      const question = `**${key}**：${value.问题}`
      const options = Object.entries(value.选项 || {})
        .map(([k, v]) => `${k}. ${v}`)
        .join('\n')
      const answer = `**答案**：${value.答案}`
      return `${question}\n\n${options}\n\n${answer}`
    })
    .join('\n\n---\n\n')
})
</script>

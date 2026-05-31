<template>
  <UCard
    id="component-case-index"
    :ui="{
      root: 'border border-default overflow-auto flex min-h-0 flex-1 flex-col',
      header: 'bg-elevated flex items-center py-2 ',
      body: 'py-0 sm:py-2 flex-1',
      footer: 'p-0 sm:p-0',
    }"
  >
    <template #header>
      <UButton icon="i-mdi-alpha-c-circle" variant="ghost" to="/cstar/case" />
      <span class="font-bold">病历</span>
      <div class="ms-auto flex gap-2">
        <ButtonCapture capture-id="component-case-index" />
        <ButtonClipboard :text="caseStore.markdown" />
        <UButton icon="i-lucide-file-volume" variant="ghost" />
        <ButtonEdit v-model="isEditing" :disabled="!caseStore.case?.content" />
        <ButtonGenerate type="case" task="generate" label="生成病例" />
      </div>
    </template>
    <template #default>
      <ClientOnly>
        <div v-if="isEditing && caseStore.case?.content" class="flex flex-1 flex-col gap-2">
          <!-- <UEditorToolbar v-if="editor" layout="fixed" :editor="editor" /> -->
          <UEditor class="min-h-0 flex-1" content-type="json" v-model="editor" />
          <!-- <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="soft" @click="cancelEdit">取消</UButton>
            <UButton color="primary" @click="saveEdit">保存</UButton>
          </div> -->
        </div>
        <div v-else>
          <UChatReasoning
            v-if="stateStore.case.isReasoning"
            :text="caseStore.case.reasoning"
            defaultOpen
            :ui="{ body: 'max-h-none pt-2' }"
            class="pt-2"
          >
            <Comark :markdown="caseStore.case.reasoning" class="*:first:mt-0 *:last:mb-0" />
          </UChatReasoning>
          <Comark :markdown="caseStore.markdown" />
        </div>
      </ClientOnly>
    </template>

    <template #footer>
      <div
        class="mx-4 my-2 flex flex-wrap gap-2"
        v-if="caseStore.case.custom?.length || Object.keys(caseStore.case.textbook?.meta ?? {}).length"
      >
        <UBadge
          v-for="sourceItem in filteredTextbookItems"
          :key="sourceItem"
          :icon="sourceItem.icon"
          variant="soft"
          color="neutral"
          size="lg"
        >
          {{ caseStore.case.textbook?.content?.[sourceItem.name] }}
        </UBadge>
        <UBadge
          v-for="custom in caseStore.case.custom"
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
const caseStore = useCaseStore()
const stateStore = useStateStore()
const textbookItems = ref([
  { icon: 'i-lucide-book', name: 'book' },
  { icon: 'i-lucide-bookmark', name: 'part' },
  { icon: 'i-lucide-table-of-contents', name: 'chapter' },
  { icon: 'i-lucide-book-marked', name: 'section' },
  { icon: 'i-lucide-book-open', name: 'subsection' },
  { icon: 'i-lucide-notepad-text', name: 'topic' },
])

const filteredTextbookItems = computed(() => {
  return textbookItems.value.filter((item) => caseStore.case.textbook?.content?.[item.name])
})

const isEditing = ref(false)
const editor = ref({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Hello World' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'This is a ' },
        { type: 'text', marks: [{ type: 'bold' }], text: 'rich text' },
        { type: 'text', text: ' editor.' },
      ],
    },
  ],
})
</script>

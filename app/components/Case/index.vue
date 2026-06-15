<template>
  <UCard
    id="component-case-index"
    :ui="{
      root: 'border border-default flex min-h-0 flex-1 flex-col',
      header: 'bg-elevated flex items-center py-2 ',
      body: 'py-0 sm:py-2 flex-1 overflow-y-auto min-h-0',
      footer: 'p-0 sm:p-0',
    }"
  >
    <template #header>
      <UButton icon="i-mdi-alpha-c-circle" variant="ghost" to="/cstar/case" />
      <span class="font-bold">病历</span>
      <div class="ms-auto flex items-center gap-2">
        <ButtonGenerate type="case" task="generate" label="生成病例" />
        <UPopover :dismissible="true" class="md:hidden" :ui="{ content: 'bg-default shadow-2xl rounded-xl ring border border-default' }">
          <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" size="sm" />
          <template #content>
            <div class="flex flex-col gap-1 p-1">
              <UButton
                icon="i-lucide-check-circle"
                variant="ghost"
                :disabled="!caseStore.case?.content"
                @click="handleVerify"
              >
                校验
              </UButton>
              <ButtonCapture capture-id="component-case-index" />
              <ButtonClipboard :text="caseStore.markdown" />
              <ButtonAudio :text="caseStore.markdown" />
              <ButtonEdit v-model="isEditing" :disabled="!caseStore.case?.content" />
            </div>
          </template>
        </UPopover>
        <div class="hidden md:flex items-center gap-2">
          <UButton
            icon="i-lucide-check-circle"
            variant="ghost"
            :disabled="!caseStore.case?.content"
            @click="handleVerify"
          >
            校验
          </UButton>
          <ButtonCapture capture-id="component-case-index" />
          <ButtonClipboard :text="caseStore.markdown" />
          <ButtonAudio :text="caseStore.markdown" />
          <ButtonEdit v-model="isEditing" :disabled="!caseStore.case?.content" />
        </div>
      </div>
    </template>
    <template #default>
      <ClientOnly>
        <EditorObject
          v-if="isEditing && caseStore.case?.content"
          v-model="caseStore.case.content"
        />
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
      <CaseVerify
        v-if="showVerify && caseStore.case?.content"
        class="mt-2"
        @close="showVerify = false"
        @edit="handleEdit"
      />
    </template>

    <template #footer>
      <div class="mx-4 my-2 flex flex-wrap gap-2 min-h-7">
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
const showVerify = ref(false)
const pendingReverify = ref(false)

watch(() => caseStore.currentType, (type, oldType) => {
  if (type === 'case') {
    showVerify.value = false
    pendingReverify.value = false
  }
  if (oldType === 'case-fix' && type !== 'case-fix' && type !== 'case-verify') {
    pendingReverify.value = true
  }
})

function handleVerify() {
  if (showVerify.value && pendingReverify.value) {
    pendingReverify.value = false
    caseStore.verify()
    return
  }
  showVerify.value = !showVerify.value
  if (showVerify.value) {
    caseStore.verify()
  }
}

function handleEdit() {
  showVerify.value = false
  isEditing.value = true
}
</script>

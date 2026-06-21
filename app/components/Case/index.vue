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
    <template v-if="props.showHeader" #header>
      <UButton icon="i-mdi-alpha-c-circle" variant="ghost" to="/cstar/case" />
      <span class="font-bold">病历</span>
      <div v-if="props.showActions" class="ms-auto flex items-center gap-2">
        <CaseToolbar
          :is-generating="isGenerating"
          :has-content="!!caseStore.case?.content"
          :markdown="caseStore.markdown"
          capture-id="component-case-index"
          v-model:editing="isEditing"
          @generate="caseStore.generate()"
          @toggle-settings="$emit('toggleSettings')"
          @verify="handleVerify"
        />
      </div>
    </template>
    <template #default>
      <ClientOnly>
        <div
          v-if="!caseStore.case?.content && caseStore.status === 'ready'"
          class="flex min-h-full flex-col items-center justify-center gap-6 px-4 py-16"
        >
          <div class="bg-muted rounded-full p-5">
            <UIcon name="i-lucide-stethoscope" class="text-muted size-10" />
          </div>
          <p class="text-muted text-center">尚未生成病历，点击下方按钮开始</p>
          <ButtonGenerate type="case" task="generate" label="生成病例" />
        </div>
        <div v-else>
          <EditorObject v-if="isEditing && caseStore.case?.content" v-model="caseStore.case.content" />
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
            <div v-if="props.mode === 'text'" class="whitespace-pre-wrap leading-relaxed">
              {{ textContent }}
            </div>
            <Comark v-else :markdown="filteredMarkdown" />
          </div>
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
      <div v-if="isFooterVisible" class="mx-4 my-2 flex min-h-7 flex-wrap gap-2">
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
const props = defineProps({
  settingsVisible: { type: Boolean, default: true },
  showFooter: { type: Boolean, default: undefined },
  showActions: { type: Boolean, default: true },
  showHeader: { type: Boolean, default: true },
  contentInclude: { type: Array, default: undefined },
  contentExclude: { type: Array, default: undefined },
  mode: { type: String, default: 'markdown' }, // 'markdown' | 'text'
})
defineEmits(['toggleSettings'])

const caseStore = useCaseStore()
const stateStore = useStateStore()

const isFooterVisible = computed(() => {
  return props.showFooter !== undefined ? props.showFooter : stateStore.showCaseFooter
})
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

const isGenerating = computed(() => caseStore.status === 'submitted' || caseStore.status === 'streaming')

const filteredContent = computed(() => {
  const content = caseStore.case.content
  if (!content) return null
  let entries = Object.entries(content)
  if (props.contentInclude?.length) {
    const set = new Set(props.contentInclude)
    entries = entries.filter(([k]) => set.has(k))
  }
  if (props.contentExclude?.length) {
    const set = new Set(props.contentExclude)
    entries = entries.filter(([k]) => !set.has(k))
  }
  return Object.fromEntries(entries)
})

const filteredMarkdown = computed(() => {
  if (!filteredContent.value) return ''
  return Object.entries(filteredContent.value)
    .map(([k, v]) => `**${k}**：${v}`)
    .join('\n\n')
})

const textContent = computed(() => {
  const content = filteredContent.value
  if (!content) return ''

  const firstFields = ['姓名', '性别', '年龄', '主诉']
  const firstParts = firstFields
    .filter(k => content[k])
    .map(k => content[k])

  let result = firstParts.join('，') + '。'

  const removeLabel = new Set(['现病史', '既往史'])
  const excludeFields = new Set(['专科查体'])

  const remaining = Object.entries(content)
    .filter(([k]) => !firstFields.includes(k))
    .filter(([k]) => !excludeFields.has(k))
    .filter(([, v]) => v && v !== '无')
    .map(([k, v]) => {
      const value = v.endsWith('。') ? v : v + '。'
      if (removeLabel.has(k)) return value
      return `${k} ${value}`
    })

  if (remaining.length > 0) {
    result += remaining.join(' ')
  }

  return result
})

const isEditing = ref(false)
const showVerify = ref(false)
const pendingReverify = ref(false)

watch(
  () => caseStore.currentType,
  (type, oldType) => {
    if (type === 'case') {
      showVerify.value = false
      pendingReverify.value = false
    }
    if (oldType === 'case-fix' && type !== 'case-fix' && type !== 'case-verify') {
      pendingReverify.value = true
    }
  },
)

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

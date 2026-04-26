<template>
  <UCard
    id="component-case-settings"
    :ui="{
      header: 'bg-elevated flex items-center py-2',
      body: 'p-0 sm:p-0 flex flex-col',
      root: 'border border-default overflow-auto',
    }"
  >
    <template #header v-if="isTitleShow">
      <UIcon name="i-lucide-cog" class="mr-2" />
      <span class="font-bold">病例设定</span>
    </template>
    <template #default>
      <UTabs :items="tabItems" variant="link" class="w-full gap-4" :ui="{ trigger: 'grow' }">
        <template #source>
          <div v-for="entry in entries" :key="entry" class="flex flex-row">
            <USelect
              :placeholder="entry.placeholder"
              v-model="entry['v-model']"
              :items="entry.items()"
              :icon="entry.icon"
              class="m-2 w-full"
              :ui="{ content: 'min-w-fit' }"
              size="lg"
              :disabled="entry.items().length === 0"
              @update:modelValue="entry['update']()"
            />
            <UButton
              icon="i-lucide-dices"
              size="lg"
              variant="ghost"
              class="m-2"
              @click="entry['random']()"
              :disabled="entry.items().length === 0"
            />
          </div>
          <div class="m-4 flex justify-end">
            <UCheckbox v-model="random" label="随机" />
          </div>
        </template>
        <template #tag>
          <div class="flex flex-col gap-2 p-2">
            <UInputTags v-model="caseStore.case.tags" icon="i-lucide-tag" size="xl" variant="ghost" />
            <div class="flex flex-row">
              <USelect v-model="selectedTagItems" :items="tagItems" multiple class="flex-1" />
              <UButton @click="updateTagItems" variant="subtle" class="ml-2">添加</UButton>
            </div>
          </div>
        </template>
      </UTabs>
    </template>
  </UCard>
</template>

<script setup>
const caseStore = useCaseStore()
const bookStore = useBookStore()

const tabItems = [
  {
    label: '来源',
    value: 'source',
    icon: 'i-lucide-book',
    slot: 'source',
  },
  {
    label: '标签',
    value: 'tag',
    icon: 'i-lucide-tag',
    slot: 'tag',
  },
]

const { isTitleShow } = defineProps({
  isTitleShow: { type: Boolean, required: false, default: true },
})
const random = ref(true)

onMounted(() => {
  caseStore.case.source = caseStore.case.source ?? {
    meta: { bookName: '', publishDate: '', edition: 0, isbn: '' },
    content: {},
  }
})

const selectedTagItems = ref([])
const tagItems = ref([
  {
    type: 'label',
    label: '年龄',
    icon: 'i-lucide-users',
  },
  '儿童',
  '青年',
  '中年',
  '老年',
  {
    type: 'separator',
  },
  {
    type: 'label',
    label: '娱乐',
    icon: 'i-lucide-gamepad',
  },
  '修仙',
  '神话',
  '穿越',
  '历史',
  '科幻',
  '都市',
  '游戏',
])
function updateTagItems() {
  selectedTagItems.value.forEach((tag) => {
    if (!caseStore.case.tags.includes(tag)) {
      caseStore.case.tags.push(tag)
    }
  })
  selectedTagItems.value = []
}

// ================ Book Selection Logic =================

const book = computed({
  get: () => caseStore.case.source?.content?.book ?? '',
  set: (value) => {
    caseStore.case.source.content.book = value
  },
})
const part = computed({
  get: () => caseStore.case.source?.content?.part ?? '',
  set: (value) => {
    caseStore.case.source.content.part = value
  },
})
const chapter = computed({
  get: () => caseStore.case.source?.content?.chapter ?? '',
  set: (value) => {
    caseStore.case.source.content.chapter = value
  },
})
const section = computed({
  get: () => caseStore.case.source?.content?.section ?? '',
  set: (value) => {
    caseStore.case.source.content.section = value
  },
})
const subsection = computed({
  get: () => caseStore.case.source?.content?.subsection ?? '',
  set: (value) => {
    caseStore.case.source.content.subsection = value
  },
})
const topic = computed({
  get: () => caseStore.case.source?.content?.topic ?? '',
  set: (value) => {
    caseStore.case.source.content.topic = value
  },
})

const books = computed(() => Object.keys(bookStore.books))

const parts = computed(() => {
  if (!book.value) return []
  return bookStore.books[book.value] ? Object.keys(bookStore.books[book.value].content) : []
})

const chapters = computed(() => {
  if (parts.value.length === 0) return []
  return bookStore.books[book.value].content[part.value]
    ? Object.keys(bookStore.books[book.value].content[part.value])
    : []
})

const sections = computed(() => {
  if (chapters.value.length === 0) return []
  return bookStore.books[book.value].content[part.value][chapter.value]
    ? Object.keys(bookStore.books[book.value].content[part.value][chapter.value])
    : []
})

const subsections = computed(() => {
  if (sections.value.length === 0) return []
  return bookStore.books[book.value].content[part.value][chapter.value][section.value]
    ? Object.keys(bookStore.books[book.value].content[part.value][chapter.value][section.value])
    : []
})

const topics = computed(() => {
  if (subsections.value.length === 0) return []
  return bookStore.books[book.value].content[part.value][chapter.value][section.value][subsection.value]
    ? Object.keys(bookStore.books[book.value].content[part.value][chapter.value][section.value][subsection.value])
    : []
})

function handleBookChange() {
  caseStore.case.source.meta = { ...bookStore.books[book.value]?.meta }
  part.value = random.value && parts.value.length > 0 ? parts.value[Math.floor(Math.random() * parts.value.length)] : ''
  handlePartChange()
}

function handlePartChange() {
  chapter.value =
    random.value && chapters.value.length > 0 ? chapters.value[Math.floor(Math.random() * chapters.value.length)] : ''
  handleChapterChange()
}

function handleChapterChange() {
  section.value =
    random.value && sections.value.length > 0 ? sections.value[Math.floor(Math.random() * sections.value.length)] : ''
  handleSectionChange()
}

function handleSectionChange() {
  subsection.value =
    random.value && subsections.value.length > 0
      ? subsections.value[Math.floor(Math.random() * subsections.value.length)]
      : ''
  handleSubsectionChange()
}

function handleSubsectionChange() {
  topic.value =
    random.value && topics.value.length > 0 ? topics.value[Math.floor(Math.random() * topics.value.length)] : ''
  handleTopicChange()
}

function handleTopicChange() {
  caseStore.case.source.content = {
    book: book.value,
    part: part.value,
    chapter: chapter.value,
    section: section.value,
    subsection: subsection.value,
    topic: topic.value,
  }
}

function randomBook() {
  if (random.value) {
    book.value = books.value[Math.floor(Math.random() * books.value.length)]
  }
  handleBookChange()
}

function randomPart() {
  if (random.value) {
    part.value = parts.value[Math.floor(Math.random() * parts.value.length)]
  }
  handlePartChange()
}

function randomChapter() {
  if (random.value) {
    chapter.value = chapters.value[Math.floor(Math.random() * chapters.value.length)]
  }
  handleChapterChange()
}

function randomSection() {
  if (random.value) {
    section.value = sections.value[Math.floor(Math.random() * sections.value.length)]
  }
  handleSectionChange()
}

function randomSubsection() {
  if (random.value) {
    subsection.value = subsections.value[Math.floor(Math.random() * subsections.value.length)]
  }
  handleSubsectionChange()
}

function randomTopic() {
  if (random.value) {
    topic.value = topics.value[Math.floor(Math.random() * topics.value.length)]
  }
  handleTopicChange()
}

const entries = ref([
  {
    placeholder: '教科书',
    'v-model': book,
    items: () => books.value,
    icon: 'i-lucide-book',
    update: handleBookChange,
    random: randomBook,
  },
  {
    placeholder: '篇目',
    'v-model': part,
    items: () => parts.value,
    icon: 'i-lucide-bookmark',
    update: handlePartChange,
    random: randomPart,
  },
  {
    placeholder: '章节',
    'v-model': chapter,
    items: () => chapters.value,
    icon: 'i-lucide-table-of-contents',
    update: handleChapterChange,
    random: randomChapter,
  },
  {
    placeholder: '节次',
    'v-model': section,
    items: () => sections.value,
    icon: 'i-lucide-book-marked',
    update: handleSectionChange,
    random: randomSection,
  },
  {
    placeholder: '子节',
    'v-model': subsection,
    items: () => subsections.value,
    icon: 'i-lucide-book-open',
    update: handleSubsectionChange,
    random: randomSubsection,
  },
  {
    placeholder: '主题',
    'v-model': topic,
    items: () => topics.value,
    icon: 'i-lucide-notepad-text',
    update: handleTopicChange,
    random: randomTopic,
  },
])
</script>

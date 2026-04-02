<template>
  <UCard
    id="component-case-settings"
    :ui="{
      header: 'bg-elevated flex items-center py-2 ',
      body: 'p-0 sm:p-0 flex flex-col',
      root: 'border border-default',
    }"
  >
    <template #header v-if="isTitleShow">
      <span class="font-bold">病例设定</span>
    </template>
    <template #default>
      <div class="flex flex-wrap">
        <div class="flex flex-wrap gap-2 mx-4 my-2">
          <UButton @click="sourceBtnClick" variant="subtle">来源</UButton>
          <UBadge
            v-for="sourceItem in filteredSourceItems"
            :key="sourceItem"
            :icon="sourceItem.icon"
            variant="soft"
            color="neutral"
            size="lg"
            >{{ caseStore.case.source?.content?.[sourceItem.name] }}</UBadge
          >
        </div>
        <div class="flex flex-wrap gap-2 mx-4 my-2">
          <UButton @click="tagBtnClick" variant="subtle">标签</UButton>
          <UBadge
            v-for="tag in caseStore.case.tags"
            :key="tag"
            variant="soft"
            color="neutral"
            size="lg"
            icon="i-lucide-tag"
            >{{ tag }}</UBadge
          >
        </div>
      </div>
      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="ring-0">
        <UCollapsible
          v-model:open="sourceCollapsibleOpen"
          class="flex flex-col gap-2 w-full"
          :ui="{ content: 'flex flex-col' }"
        >
          <template #content>
            <div v-for="entry in entries" :key="entry" class="flex flex-row">
              <USelect
                :placeholder="entry.placeholder"
                v-model="entry['v-model']"
                :items="entry.items()"
                :icon="entry.icon"
                class="w-full m-2"
                :ui="{ content: 'min-w-fit' }"
                size="lg"
                :disabled="entry.items().length === 0"
              />
              <UButton icon="i-lucide-dices" size="lg" variant="ghost" class="m-2" @click="entry['random']()" />
            </div>
            <div class="flex justify-end m-4">
              <UCheckbox v-model="random" label="随机" />
            </div>
          </template>
        </UCollapsible>
        <UCollapsible
          v-model:open="tagCollapsibleOpen"
          class="flex flex-col gap-2 w-full"
          :ui="{ content: 'flex flex-col m-2' }"
        >
          <template #content>
            <UInputTags v-model="caseStore.case.tags" icon="i-lucide-tag" size="lg" />
          </template>
        </UCollapsible>
      </UCard>
    </template>
  </UCard>
</template>

<script setup>
const caseStore = useCaseStore()
const bookStore = useBookStore()

const { isTitleShow } = defineProps({
  isTitleShow: { type: Boolean, required: false, default: true },
})
const random = ref(true)

const sourceCollapsibleOpen = ref(false)
const tagCollapsibleOpen = ref(false)

const sourceBtnClick = () => {
  sourceCollapsibleOpen.value = !sourceCollapsibleOpen.value
  tagCollapsibleOpen.value = false
}

const tagBtnClick = () => {
  tagCollapsibleOpen.value = !tagCollapsibleOpen.value
  sourceCollapsibleOpen.value = false
}

onMounted(() => {
  caseStore.case.source = caseStore.case.source ?? {
    meta: { bookName: '', publishDate: '', edition: 0, isbn: '' },
    content: {},
  }
})

const sourceItems = ref([
  { icon: 'i-lucide-book', name: 'book' },
  { icon: 'i-lucide-bookmark', name: 'part' },
  { icon: 'i-lucide-table-of-contents', name: 'chapter' },
  { icon: 'i-lucide-book-marked', name: 'section' },
  { icon: 'i-lucide-book-open', name: 'subsection' },
  { icon: 'i-lucide-notepad-text', name: 'topic' },
])

const filteredSourceItems = computed(() => {
  return sourceItems.value.filter((item) => caseStore.case.source?.content?.[item.name])
})

// ================ Book Selection Logic =================

const book = ref(caseStore.case.source?.content?.book ?? '')
const part = ref(caseStore.case.source?.content?.part ?? '')
const chapter = ref(caseStore.case.source?.content?.chapter ?? '')
const section = ref(caseStore.case.source?.content?.section ?? '')
const subsection = ref(caseStore.case.source?.content?.subsection ?? '')
const topic = ref(caseStore.case.source?.content?.topic ?? '')

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

watch([book, part, chapter, section, subsection, topic], () => {
  if (!caseStore.case.source) return
  caseStore.case.source.content = {
    book: book.value,
    part: part.value,
    chapter: chapter.value,
    section: section.value,
    subsection: subsection.value,
    topic: topic.value,
  }
})

watch(book, (value) => {
  if (!caseStore.case.source) return
  caseStore.case.source.meta = { ...bookStore.books[value]?.meta }
  part.value = random.value && parts.value.length > 0 ? parts.value[Math.floor(Math.random() * parts.value.length)] : ''
})

watch(part, (value) => {
  if (!caseStore.case.source) return
  chapter.value =
    random.value && chapters.value.length > 0 ? chapters.value[Math.floor(Math.random() * chapters.value.length)] : ''
})

watch(chapter, (value) => {
  if (!caseStore.case.source) return
  section.value =
    random.value && sections.value.length > 0 ? sections.value[Math.floor(Math.random() * sections.value.length)] : ''
})

watch(section, (value) => {
  if (!caseStore.case.source) return
  subsection.value =
    random.value && subsections.value.length > 0
      ? subsections.value[Math.floor(Math.random() * subsections.value.length)]
      : ''
})

watch(subsection, (value) => {
  if (!caseStore.case.source) return
  topic.value =
    random.value && topics.value.length > 0 ? topics.value[Math.floor(Math.random() * topics.value.length)] : ''
})

function randomBook() {
  if (random.value) {
    book.value = books.value[Math.floor(Math.random() * books.value.length)]
  }
}

function randomPart() {
  if (random.value) {
    part.value = parts.value[Math.floor(Math.random() * parts.value.length)]
  }
}

function randomChapter() {
  if (random.value) {
    chapter.value = chapters.value[Math.floor(Math.random() * chapters.value.length)]
  }
}

function randomSection() {
  if (random.value) {
    section.value = sections.value[Math.floor(Math.random() * sections.value.length)]
  }
}

function randomSubsection() {
  if (random.value) {
    subsection.value = subsections.value[Math.floor(Math.random() * subsections.value.length)]
  }
}

function randomTopic() {
  if (random.value) {
    topic.value = topics.value[Math.floor(Math.random() * topics.value.length)]
  }
}

const entries = ref([
  {
    placeholder: '教科书',
    'v-model': book,
    items: () => books.value,
    icon: 'i-lucide-book',
    random: randomBook,
  },
  {
    placeholder: '篇目',
    'v-model': part,
    items: () => parts.value,
    icon: 'i-lucide-bookmark',
    random: randomPart,
  },
  {
    placeholder: '章节',
    'v-model': chapter,
    items: () => chapters.value,
    icon: 'i-lucide-table-of-contents',
    random: randomChapter,
  },
  {
    placeholder: '节次',
    'v-model': section,
    items: () => sections.value,
    icon: 'i-lucide-book-marked',
    random: randomSection,
  },
  {
    placeholder: '子节',
    'v-model': subsection,
    items: () => subsections.value,
    icon: 'i-lucide-book-open',
    random: randomSubsection,
  },
  {
    placeholder: '主题',
    'v-model': topic,
    items: () => topics.value,
    icon: 'i-lucide-notepad-text',
    random: randomTopic,
  },
])
</script>

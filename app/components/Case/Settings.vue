<template>
  <UCard
    id="component-case-settings"
    :ui="{
      header: 'bg-elevated flex items-center py-2',
      body: 'p-0 sm:p-0 flex min-h-0 flex-1 flex-col',
      root: 'border border-default overflow-auto flex min-h-0 flex-1 flex-col',
    }"
  >
    <template #header>
      <UIcon name="i-lucide-cog" class="mr-2" />
      <span class="font-bold">病历设定</span>
    </template>
    <template #default>
      <UTabs :items="tabItems" variant="link" class="w-full" :ui="{ trigger: 'grow' }" defaultValue="textbook">
        <template #textbook>
          <div v-for="entry in entries" :key="entry" class="flex flex-row">
            <USelect
              :placeholder="entry.placeholder"
              v-model="entry['v-model']"
              :items="entry.items()"
              :icon="entry.icon"
              class="m-2 w-full"
              :ui="{ content: 'min-w-fit' }"
              variant="soft"
              size="lg"
              :disabled="entry.items().length === 0"
              @update:modelValue="entry['update']()"
            />
            <UButton
              icon="i-lucide-x"
              color="error"
              size="lg"
              variant="ghost"
              class="m-0 px-0"
              @click="entry['clear']()"
              :disabled="entry.items().length === 0"
            />
            <UButton
              icon="i-lucide-dices"
              size="lg"
              variant="ghost"
              class="m-0 px-2"
              @click="entry['random']()"
              :disabled="entry.items().length === 0"
            />
          </div>
          <div class="m-4 flex justify-end">
            <UCheckbox v-model="random" label="随机" />
          </div>
        </template>
        <template #custom>
          <div class="flex flex-col gap-2 p-2">
            <UInputTags
              v-model="stateStore.case.custom"
              icon="i-lucide-tag"
              size="xl"
              variant="soft"
              placeholder="输入按回车键确认或添加..."
            />
            <div class="flex flex-row">
              <USelect v-model="selectedCustomItems" :items="customItems" multiple class="flex-1" variant="soft" />
              <UButton @click="updateCustomItems" variant="subtle" class="ml-2">添加</UButton>
            </div>
          </div>
        </template>
        <template #model>
          <div class="m-4 flex flex-col">
            <SelectModel scene="case" />
          </div>
        </template>
      </UTabs>
    </template>
  </UCard>
</template>

<script setup>
const stateStore = useStateStore()
const bookStore = useBookStore()

const tabItems = [
  {
    label: '教科书',
    value: 'textbook',
    icon: 'i-lucide-book',
    slot: 'textbook',
  },
  {
    label: '自定义',
    value: 'custom',
    icon: 'i-lucide-pencil',
    slot: 'custom',
  },
  {
    label: '模型',
    value: 'model',
    icon: 'i-lucide-cpu',
    slot: 'model',
  },
]

const { isTitleShow } = defineProps({
  isTitleShow: { type: Boolean, required: false, default: true },
})
const random = ref(true)

onMounted(() => {
  stateStore.case.textbook = stateStore.case.textbook ?? {
    meta: { bookName: '', publishDate: '', edition: 0, isbn: '' },
    content: {},
  }
})

const selectedCustomItems = ref([])
const customItems = ref([
  {
    type: 'label',
    label: '年龄',
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
  },
  '修仙',
  '神话',
  '穿越',
  '历史',
  '科幻',
  '都市',
  '游戏',
])
function updateCustomItems() {
  selectedCustomItems.value.forEach((customItem) => {
    if (!stateStore.case.custom.includes(customItem)) {
      stateStore.case.custom.push(customItem)
    }
  })
  selectedCustomItems.value = []
}

// ================ Book Selection Logic =================

const book = computed({
  get: () => stateStore.case.textbook?.content?.book ?? '',
  set: (value) => {
    stateStore.case.textbook.content.book = value
  },
})
const part = computed({
  get: () => stateStore.case.textbook?.content?.part ?? '',
  set: (value) => {
    stateStore.case.textbook.content.part = value
  },
})
const chapter = computed({
  get: () => stateStore.case.textbook?.content?.chapter ?? '',
  set: (value) => {
    stateStore.case.textbook.content.chapter = value
  },
})
const section = computed({
  get: () => stateStore.case.textbook?.content?.section ?? '',
  set: (value) => {
    stateStore.case.textbook.content.section = value
  },
})
const subsection = computed({
  get: () => stateStore.case.textbook?.content?.subsection ?? '',
  set: (value) => {
    stateStore.case.textbook.content.subsection = value
  },
})
const topic = computed({
  get: () => stateStore.case.textbook?.content?.topic ?? '',
  set: (value) => {
    stateStore.case.textbook.content.topic = value
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
  stateStore.case.textbook.meta = { ...bookStore.books[book.value]?.meta }
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
  stateStore.case.textbook.content = {
    book: book.value,
    part: part.value,
    chapter: chapter.value,
    section: section.value,
    subsection: subsection.value,
    topic: topic.value,
  }
}

const entries = ref([
  {
    placeholder: '教科书',
    'v-model': book,
    items: () => books.value,
    icon: 'i-lucide-book',
    update: handleBookChange,
    clear: () => {
      book.value = ''
      handleBookChange()
    },
    random: () => {
      if (random.value) {
        book.value = books.value[Math.floor(Math.random() * books.value.length)]
      }
      handleBookChange()
    },
  },
  {
    placeholder: '篇目',
    'v-model': part,
    items: () => parts.value,
    icon: 'i-lucide-bookmark',
    update: handlePartChange,
    clear: () => {
      part.value = ''
      handlePartChange()
    },
    random: () => {
      if (random.value) {
        part.value = parts.value[Math.floor(Math.random() * parts.value.length)]
      }
      handlePartChange()
    },
  },
  {
    placeholder: '章节',
    'v-model': chapter,
    items: () => chapters.value,
    icon: 'i-lucide-table-of-contents',
    update: handleChapterChange,
    clear: () => {
      chapter.value = ''
      handleChapterChange()
    },
    random: () => {
      if (random.value) {
        chapter.value = chapters.value[Math.floor(Math.random() * chapters.value.length)]
      }
      handleChapterChange()
    },
  },
  {
    placeholder: '节次',
    'v-model': section,
    items: () => sections.value,
    icon: 'i-lucide-book-marked',
    update: handleSectionChange,
    clear: () => {
      section.value = ''
      handleSectionChange()
    },
    random: () => {
      if (random.value) {
        section.value = sections.value[Math.floor(Math.random() * sections.value.length)]
      }
      handleSectionChange()
    },
  },
  {
    placeholder: '子节',
    'v-model': subsection,
    items: () => subsections.value,
    icon: 'i-lucide-book-open',
    update: handleSubsectionChange,
    clear: () => {
      subsection.value = ''
      handleSubsectionChange()
    },
    random: () => {
      if (random.value) {
        subsection.value = subsections.value[Math.floor(Math.random() * subsections.value.length)]
      }
      handleSubsectionChange()
    },
  },
  {
    placeholder: '主题',
    'v-model': topic,
    items: () => topics.value,
    icon: 'i-lucide-notepad-text',
    update: handleTopicChange,
    clear: () => {
      topic.value = ''
      handleTopicChange()
    },
    random: () => {
      if (random.value) {
        topic.value = topics.value[Math.floor(Math.random() * topics.value.length)]
      }
      handleTopicChange()
    },
  },
])
</script>

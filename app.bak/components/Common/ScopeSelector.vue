<template>
  <v-card hover rounded="lg">
    <v-toolbar v-if="isTitleShow" density="comfortable">
      <template #prepend>
        <v-btn :icon="mdiMedicalBag" variant="plain" />
      </template>
      <v-toolbar-title class="font-weight-bold ml-0" text="疾病范围" />
    </v-toolbar>
    <v-card-text class="py-0">
      <v-chip-group column>
        <v-chip
          v-for="item in filteredItems"
          :key="item"
          variant="text"
          :prepend-icon="item.icon"
          size="large"
        >
          {{ stateStore.scope[item.name] }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-expansion-panels color="grey-lighten-3">
      <v-expansion-panel title="请选择">
        <v-expansion-panel-text>
          <v-select
            v-for="entry in entries"
            :key="entry"
            v-model="entry['v-model']"
            :label="entry.label"
            :items="entry.items()"
            variant="outlined"
            class="my-4"
            hide-details="auto"
            density="comfortable"
            clearable
            :append-icon="mdiAutorenew"
            :prepend-inner-icon="entry['prepend-inner-icon']"
            :disabled="entry.items().length === 0"
            @click:append="entry['click-append']()"
            @update:model-value="entry['update-model-value']()"
          />

          <div class="d-flex justify-end">
            <v-checkbox
              v-model="random"
              max-width="70px"
              label="随机"
              density="compact"
              hide-details
            />
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script setup>
import {
  mdiMedicalBag,
  mdiAutorenew,
  mdiBookOpenVariantOutline,
  mdiBookmarkMultipleOutline,
  mdiBookOutline,
  mdiBookmarkOutline,
} from '@mdi/js'
const { isTitleShow } = defineProps({
  isTitleShow: { type: Boolean, required: false, default: true },
})
const stateStore = useStateStore()
const bookStore = useBookStore()
const items = ref([
  { icon: mdiBookOpenVariantOutline, name: 'book' },
  { icon: mdiBookmarkMultipleOutline, name: 'part' },
  { icon: mdiBookmarkMultipleOutline, name: 'chapter' },
  { icon: mdiBookOutline, name: 'section' },
  { icon: mdiBookmarkOutline, name: 'subsection' },
  { icon: mdiBookmarkOutline, name: 'topic' },
])
const filteredItems = computed(() => {
  return items.value.filter((item) => stateStore.scope[item.name])
})

const random = ref(true)

const books = computed(() => Object.keys(bookStore.books))
const book = ref(stateStore.scope.book)

const parts = computed(() => {
  if (!book.value) return []
  return bookStore.books[book.value] ? Object.keys(bookStore.books[book.value]) : []
})
const part = ref(stateStore.scope.part)

const chapters = computed(() => {
  if (parts.value.length === 0) return []
  return bookStore.books[book.value][part.value]
    ? Object.keys(bookStore.books[book.value][part.value])
    : []
})
const chapter = ref(stateStore.scope.chapter)

const sections = computed(() => {
  if (chapters.value.length === 0) return []
  return bookStore.books[book.value][part.value][chapter.value]
    ? Object.keys(bookStore.books[book.value][part.value][chapter.value])
    : []
})
const section = ref(stateStore.scope.section)

const subsections = computed(() => {
  if (sections.value.length === 0) return []
  return bookStore.books[book.value][part.value][chapter.value][section.value]
    ? Object.keys(bookStore.books[book.value][part.value][chapter.value][section.value])
    : []
})
const subsection = ref(stateStore.scope.subsection)

const topics = computed(() => {
  if (subsections.value.length === 0) return []
  return bookStore.books[book.value][part.value][chapter.value][section.value][subsection.value]
    ? Object.keys(
        bookStore.books[book.value][part.value][chapter.value][section.value][subsection.value]
      )
    : []
})
const topic = ref(stateStore.scope.topic)

function randomBook() {
  if (random.value) {
    book.value = books.value[Math.floor(Math.random() * books.value.length)]
    handleBookChange()
  }
}

function handleBookChange() {
  if (random.value) {
    part.value = parts.value[Math.floor(Math.random() * parts.value.length)]
  } else {
    part.value = ''
  }
  handlePartChange()
}

function randomPart() {
  if (random.value) {
    part.value = parts.value[Math.floor(Math.random() * parts.value.length)]
    handlePartChange()
  }
}
function handlePartChange() {
  if (random.value) {
    chapter.value = chapters.value[Math.floor(Math.random() * chapters.value.length)]
  } else {
    chapter.value = ''
  }
  handleChapterChange()
}

function randomChapter() {
  if (random.value) {
    chapter.value = chapters.value[Math.floor(Math.random() * chapters.value.length)]
    handleChapterChange()
  }
}
function handleChapterChange() {
  if (random.value) {
    section.value = sections.value[Math.floor(Math.random() * sections.value.length)]
  } else {
    section.value = ''
  }
  handleSectionChange()
}

function randomSection() {
  if (random.value) {
    section.value = sections.value[Math.floor(Math.random() * sections.value.length)]
    handleSectionChange()
  }
}
function handleSectionChange() {
  if (random.value) {
    subsection.value = subsections.value[Math.floor(Math.random() * subsections.value.length)]
  } else {
    subsection.value = ''
  }
  handleSubsectionChange()
}

function randomSubsection() {
  if (random.value) {
    subsection.value = subsections.value[Math.floor(Math.random() * subsections.value.length)]
    handleSubsectionChange()
  }
}
function handleSubsectionChange() {
  if (random.value) {
    topic.value = topics.value[Math.floor(Math.random() * topics.value.length)]
  } else {
    topic.value = ''
  }
  handleTopicChange()
}

function randomTopic() {
  if (random.value) {
    topic.value = topics.value[Math.floor(Math.random() * topics.value.length)]
    handleTopicChange()
  }
}
function handleTopicChange() {
  handleScope()
}

function handleScope() {
  stateStore.scope = {
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
    label: '教科书',
    'prepend-inner-icon': mdiBookOpenVariantOutline,
    items: () => books.value,
    'v-model': book,
    'click-append': randomBook,
    'update-model-value': handleBookChange,
  },
  {
    label: '篇目',
    'prepend-inner-icon': mdiBookmarkMultipleOutline,
    items: () => parts.value,
    'v-model': part,
    'click-append': randomPart,
    'update-model-value': handlePartChange,
  },
  {
    label: '章节',
    'prepend-inner-icon': mdiBookmarkMultipleOutline,
    items: () => chapters.value,
    'v-model': chapter,
    'click-append': randomChapter,
    'update-model-value': handleChapterChange,
  },
  {
    label: '节次',
    'prepend-inner-icon': mdiBookOutline,
    items: () => sections.value,
    'v-model': section,
    'click-append': randomSection,
    'update-model-value': handleSectionChange,
  },
  {
    label: '子节',
    'prepend-inner-icon': mdiBookmarkOutline,
    items: () => subsections.value,
    'v-model': subsection,
    'click-append': randomSubsection,
    'update-model-value': handleSubsectionChange,
  },
  {
    label: '主题',
    'prepend-inner-icon': mdiBookmarkOutline,
    items: () => topics.value,
    'v-model': topic,
    'click-append': randomTopic,
    'update-model-value': handleTopicChange,
  },
])
</script>

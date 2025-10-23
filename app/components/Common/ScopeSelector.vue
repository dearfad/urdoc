<template>
  <v-card subtitle="疾病范围" hover rounded="lg">
    <v-card-text>
      <v-chip-group column>
        <v-chip v-for="item in filteredItems" :key="item" variant="text" :prepend-icon="item.icon">
          {{ stateStore.scope[item.name] }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-expansion-panels v-model="panel" color="grey-lighten-3">
      <v-expansion-panel value="book" title="请选择">
        <v-expansion-panel-text>
          <v-expand-transition>
            <div v-if="isExpandShow">
              <v-select
                v-model="book"
                label="教科书"
                :items="books"
                variant="outlined"
                class="my-4"
                hide-details="auto"
                prepend-inner-icon="mdi-book-open-variant-outline"
                density="comfortable"
                clearable
                append-icon="mdi-autorenew"
                @click:append="randomBook"
                @update:model-value="handleBookChange"
              />
              <v-select
                v-model="part"
                label="篇目"
                :items="parts"
                variant="outlined"
                class="my-4"
                hide-details="auto"
                density="comfortable"
                prepend-inner-icon="mdi-bookmark-multiple-outline"
                clearable
                :disabled="parts.length === 0"
                append-icon="mdi-autorenew"
                @update:model-value="handlePartChange"
                @click:append="randomPart"
              />
              <v-select
                v-model="chapter"
                label="章节"
                :items="chapters"
                variant="outlined"
                class="my-4"
                hide-details="auto"
                density="comfortable"
                prepend-inner-icon="mdi-bookmark-multiple-outline"
                clearable
                :disabled="chapters.length === 0"
                append-icon="mdi-autorenew"
                @click:append="randomChapter"
                @update:model-value="handleChapterChange"
              />
              <v-select
                v-model="section"
                label="节次"
                :items="sections"
                variant="outlined"
                class="my-4"
                hide-details="auto"
                density="comfortable"
                prepend-inner-icon="mdi-book-outline"
                clearable
                :disabled="sections.length === 0"
                append-icon="mdi-autorenew"
                @update:model-value="handleSectionChange"
                @click:append="randomSection"
              />
              <v-select
                v-model="subsection"
                label="子节"
                :items="subsections"
                variant="outlined"
                class="my-4"
                density="comfortable"
                prepend-inner-icon="mdi-bookmark-outline"
                clearable
                :disabled="subsections.length === 0"
                hide-details="auto"
                append-icon="mdi-autorenew"
                @update:model-value="handleSubsectionChange"
                @click:append="randomSubsection"
              />
              <v-select
                v-model="topic"
                label="主题"
                :items="topics"
                variant="outlined"
                class="my-4"
                density="comfortable"
                prepend-inner-icon="mdi-bookmark-outline"
                clearable
                :disabled="topics.length === 0"
                hide-details="auto"
                append-icon="mdi-autorenew"
                @update:model-value="handleTopicChange"
                @click:append="randomTopic"
              />
              <div class="d-flex flex-column align-end mt-2">
                <v-checkbox
                  v-model="random"
                  max-width="70px"
                  label="随机"
                  density="compact"
                  hide-details
                />
              </div>
            </div>
          </v-expand-transition>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script setup>
const stateStore = useStateStore()
const bookStore = useBookStore()
const isExpandShow = ref(true)
const panel = ref('book')
const items = ref([
  { icon: 'mdi-book-open-variant-outline', name: 'book' },
  { icon: 'mdi-bookmark-multiple-outline', name: 'part' },
  { icon: 'mdi-bookmark-multiple-outline', name: 'chapter' },
  { icon: 'mdi-book-outline', name: 'section' },
  { icon: 'mdi-bookmark-outline', name: 'subsection' },
  { icon: 'mdi-bookmark-outline', name: 'topic' },
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
</script>

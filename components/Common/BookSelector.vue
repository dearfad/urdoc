<template>
  <v-sheet class="px-4 my-3" elevation="4" rounded="lg">
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
      @update:model-value="handleBookChange"
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
      @update:model-value="handleSectionChange"
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
      @update:model-value="handleSubSectionChange"
    />
  </v-sheet>
</template>

<script setup lang="ts">
const stateStore = useStateStore()
const bookStore = useBookStore()

const books = Object.keys(bookStore.books)
const book = ref(stateStore.bookScope.book)

const chapters = computed(() => {
  return bookStore.books[book.value] ? Object.keys(bookStore.books[book.value]) : []
})
const chapter = ref(stateStore.bookScope.chapter)

const sections = computed(() => {
  if (chapters.value.length === 0) return []
  return bookStore.books[book.value][chapter.value]
    ? Object.keys(bookStore.books[book.value][chapter.value])
    : []
})
const section = ref(stateStore.bookScope.section)

const subsections = computed(() => {
  if (sections.value.length === 0) return []
  return bookStore.books[book.value][chapter.value][section.value]
    ? Object.keys(bookStore.books[book.value][chapter.value][section.value])
    : []
})
const subsection = ref(stateStore.bookScope.subsection)

function handleBookChange() {
  chapter.value = ''
  handleChapterChange()
}

function handleChapterChange() {
  section.value = ''
  handleSectionChange()
}

function handleSectionChange() {
  subsection.value = ''
  handleSubSectionChange()
}

function handleSubSectionChange() {
  handleBookScope()
}

function handleBookScope() {
  stateStore.bookScope = {
    book: book.value,
    chapter: chapter.value,
    section: section.value,
    subsection: subsection.value,
  }
}
</script>

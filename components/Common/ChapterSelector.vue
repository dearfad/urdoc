<template>
  <v-sheet class="px-4 my-3" elevation="4" rounded="lg">
    <v-select
      v-model="stateStore.selectedBook"
      label="教科书"
      :items="books"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      prepend-inner-icon="mdi-book-open-variant-outline"
      density="comfortable"
      @update:model-value="handleBookChange"
    />
    <v-select
      v-model="stateStore.selectedChapter"
      label="章节"
      :items="chapters"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      prepend-inner-icon="mdi-bookmark-multiple-outline"
      :disabled="!stateStore.selectedBook || chapters.length === 0"
      @update:model-value="handleChapterChange"
    />
    <v-select
      v-model="stateStore.selectedSection"
      label="节次"
      :items="sections"
      variant="outlined"
      class="my-4"
      hide-details="auto"
      density="comfortable"
      prepend-inner-icon="mdi-book-outline"
      :disabled="!stateStore.selectedChapter || sections.length === 0"
      @update:model-value="handleSectionChange"
    />
    <v-select
      v-model="stateStore.selectedSubsection"
      label="子节"
      :items="subsections"
      variant="outlined"
      class="my-4"
      density="comfortable"
      prepend-inner-icon="mdi-bookmark-outline"
      :disabled="!stateStore.selectedSection || subsections.length === 0"
      hide-details="auto"
    />
  </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()

// 处理教科书、章节、节次、子节的匹配
const chapterStore = useChapterStore()

const books = computed(() => {
  return [...Object.keys(chapterStore.chapter)]
})

const chapters = computed(() => {
  return stateStore.selectedBook === null
    ? []
    : [...Object.keys(chapterStore.chapter[stateStore.selectedBook] || {})]
})

const sections = computed(() => {
  if (stateStore.selectedChapter) {
    return chapterStore.chapter[stateStore.selectedBook][stateStore.selectedChapter] == {}
      ? []
      : [
          ...Object.keys(
            chapterStore.chapter[stateStore.selectedBook][stateStore.selectedChapter] || {}
          ),
        ]
  } else {
    return []
  }
})

const subsections = computed(() => {
  if (stateStore.selectedSection) {
    return chapterStore.chapter[stateStore.selectedBook][stateStore.selectedChapter][
      stateStore.selectedSection
    ] == {}
      ? []
      : [
          ...Object.keys(
            chapterStore.chapter[stateStore.selectedBook][stateStore.selectedChapter][
              stateStore.selectedSection
            ] || {}
          ),
        ]
  } else {
    return []
  }
})

function handleBookChange() {
  stateStore.selectedChapter = null
  stateStore.selectedSection = null
  stateStore.selectedSubsection = null
}

function handleChapterChange() {
  stateStore.selectedSection = null
  stateStore.selectedSubsection = null
}

function handleSectionChange() {
  stateStore.selectedSubsection = null
}
</script>

<template>
    <v-sheet>
        <v-select
            v-model="selectedBook"
            label="教科书"
            :items="books"
            variant="outlined"
            class="my-4"
            hide-details="auto"
            clearable
            @update:model-value="handleBookChange"
        />
        <v-select
            v-model="selectedChapter"
            label="章节"
            :items="chapters"
            variant="outlined"
            class="my-4"
            hide-details="auto"
            clearable
            :disabled="!selectedBook || chapters.length === 0"
            @update:model-value="handleChapterChange"
        />
        <v-select
            v-model="selectedSection"
            label="节次"
            :items="sections"
            variant="outlined"
            class="my-4"
            hide-details="auto"
            clearable
            :disabled="!selectedChapter || sections.length === 0"
            @update:model-value="handleSectionChange"
        />
        <v-select
            v-model="selectedSubsection"
            label="子节"
            :items="subsections"
            variant="outlined"
            class="my-4"
            clearable
            :disabled="!selectedSection || subsections.length === 0"
            hide-details="auto"
        />
        <v-text-field
            v-model="caseTag"
            label="设定"
            variant="outlined"
            class="my-4"
            hide-details="auto"
            clearable
            placeholder="多个要点请用空格隔开"
        />
    </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
const { selectedBook, selectedChapter, selectedSection, selectedSubsection, caseTag } =
    storeToRefs(stateStore)

// 处理教科书、章节、节次、子节的匹配
const chapterStore = useChapterStore()
const { chapter } = storeToRefs(chapterStore)

const books = computed(() => {
    return [...Object.keys(chapter.value)]
})

const chapters = computed(() => {
    return selectedBook.value === null
        ? []
        : [...Object.keys(chapter.value[selectedBook.value] || {})]
})

const sections = computed(() => {
    if (selectedChapter.value) {
        return chapter.value[selectedBook.value][selectedChapter.value] == {}
            ? []
            : [...Object.keys(chapter.value[selectedBook.value][selectedChapter.value] || {})]
    } else {
        return []
    }
})

const subsections = computed(() => {
    if (selectedSection.value) {
        return chapter.value[selectedBook.value][selectedChapter.value][selectedSection.value] == {}
            ? []
            : [
                  ...Object.keys(
                      chapter.value[selectedBook.value][selectedChapter.value][
                          selectedSection.value
                      ] || {}
                  ),
              ]
    } else {
        return []
    }
})

// v-select clearable 默认为 null
function handleBookChange() {
    selectedChapter.value = null
    selectedSection.value = null
    selectedSubsection.value = null
}

function handleChapterChange() {
    selectedSection.value = null
    selectedSubsection.value = null
}

function handleSectionChange() {
    selectedSubsection.value = null
}
</script>

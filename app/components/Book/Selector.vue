<template>
  <UCard
    id="component-book-selector"
    :ui="{ header: 'bg-elevated flex items-center py-2 ', body: 'p-0 sm:p-0', root: 'border border-default' }"
  >
    <template #header>
      <!-- <v-toolbar v-if="isTitleShow" density="comfortable">
        <template #prepend>
          <v-btn :icon="mdiMedicalBag" variant="plain" />
        </template>
        <v-toolbar-title class="font-weight-bold ml-0" text="疾病范围" />
      </v-toolbar> -->
      <UButton icon="i-lucide-book" variant="ghost" />
      <span class="font-bold">疾病范围</span>
    </template>
    <template #default>
      <div class="p-2">
        <UBadge icon="i-lucide-book" variant="soft" color="neutral" size="lg">外科学</UBadge>
      </div>
      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <UCollapsible class="flex flex-col gap-2 w-full" :ui="{ content: 'flex flex-col' }">
          <UButton label="选择" trailing-icon="i-lucide-chevron-down" block variant="soft" color="neutral" />
          <template #content>
            <!-- <v-select
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
            /> -->
            <div v-for="entry in entries" :key="entry" class="flex flex-row">
              <USelect
                :placeholder="entry.placeholder"
                v-model="entry['v-model']"
                :items="entry.items()"
                :icon="entry.icon"
                class="w-full m-2"
                :ui="{ content: 'min-w-fit' }"
                size="lg"
                clear
                clear-icon="i-lucide-x"
                @update:modelValue="entry['update-modelValue']()"
              />
              <UButton icon="i-lucide-dices" size="lg" variant="ghost" class="m-2" />
            </div>
            <div class="flex justify-end m-4">
              <UCheckbox v-model="random" label="随机" />
            </div>
          </template>
        </UCollapsible>
      </UCard>
    </template>
  </UCard>
  <!-- <v-card hover rounded="lg">
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
  </v-card> -->
</template>

<script setup>
const stateStore = useStateStore()
const bookStore = useBookStore()

const random = ref(true)

const book = ref(stateStore.scope.book)
const books = computed(() => Object.keys(bookStore.books))

const part = ref(stateStore.scope.part)
const parts = computed(() => {
  if (!book.value) return []
  return bookStore.books[book.value] ? Object.keys(bookStore.books[book.value].content) : []
})

const chapter = ref(stateStore.scope.chapter)
const chapters = computed(() => {
  if (parts.value.length === 0) return []
  return bookStore.books[book.value].content[part.value]
    ? Object.keys(bookStore.books[book.value].content[part.value])
    : []
})

const section = ref(stateStore.scope.section)
const sections = computed(() => {
  if (chapters.value.length === 0) return []
  return bookStore.books[book.value].content[part.value][chapter.value]
    ? Object.keys(bookStore.books[book.value].content[part.value][chapter.value])
    : []
})

const subsection = ref(stateStore.scope.subsection)
const subsections = computed(() => {
  if (sections.value.length === 0) return []
  return bookStore.books[book.value].content[part.value][chapter.value][section.value]
    ? Object.keys(bookStore.books[book.value].content[part.value][chapter.value][section.value])
    : []
})

const topic = ref(stateStore.scope.topic)
const topics = computed(() => {
  if (subsections.value.length === 0) return []
  return bookStore.books[book.value].content[part.value][chapter.value][section.value][subsection.value]
    ? Object.keys(bookStore.books[book.value].content[part.value][chapter.value][section.value][subsection.value])
    : []
})

// const { isTitleShow } = defineProps({
//   isTitleShow: { type: Boolean, required: false, default: true },
// })

// const items = ref([
//   { icon: mdiBookOpenVariantOutline, name: 'book' },
//   { icon: mdiBookmarkMultipleOutline, name: 'part' },
//   { icon: mdiBookmarkMultipleOutline, name: 'chapter' },
//   { icon: mdiBookOutline, name: 'section' },
//   { icon: mdiBookmarkOutline, name: 'subsection' },
//   { icon: mdiBookmarkOutline, name: 'topic' },
// ])
// const filteredItems = computed(() => {
//   return items.value.filter((item) => stateStore.scope[item.name])
// })

// function randomBook() {
//   if (random.value) {
//     book.value = books.value[Math.floor(Math.random() * books.value.length)]
//     handleBookChange()
//   }
// }

function handleBookChange() {
  if (random.value) {
    part.value = parts.value[Math.floor(Math.random() * parts.value.length)]
  } else {
    part.value = ''
  }
  handlePartChange()
}

// function randomPart() {
//   if (random.value) {
//     part.value = parts.value[Math.floor(Math.random() * parts.value.length)]
//     handlePartChange()
//   }
// }

function handlePartChange() {
  if (random.value) {
    chapter.value = chapters.value[Math.floor(Math.random() * chapters.value.length)]
  } else {
    chapter.value = ''
  }
  handleChapterChange()
}

// function randomChapter() {
//   if (random.value) {
//     chapter.value = chapters.value[Math.floor(Math.random() * chapters.value.length)]
//     handleChapterChange()
//   }
// }
function handleChapterChange() {
  if (random.value) {
    section.value = sections.value[Math.floor(Math.random() * sections.value.length)]
  } else {
    section.value = ''
  }
  handleSectionChange()
}

// function randomSection() {
//   if (random.value) {
//     section.value = sections.value[Math.floor(Math.random() * sections.value.length)]
//     handleSectionChange()
//   }
// }

function handleSectionChange() {
  if (random.value) {
    subsection.value = subsections.value[Math.floor(Math.random() * subsections.value.length)]
  } else {
    subsection.value = ''
  }
  handleSubsectionChange()
}

// function randomSubsection() {
//   if (random.value) {
//     subsection.value = subsections.value[Math.floor(Math.random() * subsections.value.length)]
//     handleSubsectionChange()
//   }
// }

function handleSubsectionChange() {
  if (random.value) {
    topic.value = topics.value[Math.floor(Math.random() * topics.value.length)]
  } else {
    topic.value = ''
  }
  handleTopicChange()
}

// function randomTopic() {
//   if (random.value) {
//     topic.value = topics.value[Math.floor(Math.random() * topics.value.length)]
//     handleTopicChange()
//   }
// }

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
    placeholder: '教科书',
    'v-model': book,
    items: () => books.value,
    icon: 'i-lucide-book',
    'update-modelValue': handleBookChange,
    // 'prepend-inner-icon': mdiBookOpenVariantOutline,
    // 'click-append': randomBook,
  },
  {
    placeholder: '篇目',
    'v-model': part,
    items: () => parts.value,
    icon: 'i-lucide-bookmark',
    'update-modelValue': handlePartChange,
    // 'prepend-inner-icon': mdiBookmarkMultipleOutline,
    // 'click-append': randomPart,
  },
  {
    placeholder: '章节',
    'v-model': chapter,
    items: () => chapters.value,
    icon: 'i-lucide-table-of-contents',
    'update-modelValue': handleChapterChange,
    // 'prepend-inner-icon': mdiBookmarkMultipleOutline,
    // 'click-append': randomChapter,
  },
  {
    placeholder: '节次',
    'v-model': section,
    items: () => sections.value,
    icon: 'i-lucide-book-marked',
    'update-modelValue': handleSectionChange,
    // 'prepend-inner-icon': mdiBookOutline,
    // 'click-append': randomSection,
  },
  {
    placeholder: '子节',
    'v-model': subsection,
    items: () => subsections.value,
    icon: 'i-lucide-book-open',
    'update-modelValue': handleSubsectionChange,
    // 'prepend-inner-icon': mdiBookmarkOutline,
    // 'click-append': randomSubsection,
  },
  {
    placeholder: '主题',
    'v-model': topic,
    items: () => topics.value,
    icon: 'i-lucide-notepad-text',
    'update-modelValue': handleTopicChange,
    // 'prepend-inner-icon': mdiBookmarkOutline,
    // 'click-append': randomTopic,
  },
])
</script>

<template>
    <v-sheet>
        <v-select
            v-model="selectedBook"
            label="教科书"
            :items="books"
            variant="outlined"
            class="my-4"
            hide-details="auto"
            @update:model-value="handleBookChange"
        />
        <v-select
            v-model="selectedChapter"
            label="章节"
            :items="chapters"
            variant="outlined"
            class="my-4"
            hide-details="auto"
            @update:model-value="handleChapterChange"
        />
        <v-select
            v-model="selectedSection"
            label="节次"
            :items="sections"
            variant="outlined"
            class="my-4"
            hide-details="auto"
            @update:model-value="handleSectionChange"
        />
        <v-select
            v-model="selectedSubsection"
            label="子节"
            :items="subsections"
            variant="outlined"
            class="my-4"
            hide-details="auto"
        />
        <v-text-field
            v-model="genCaseKeyPoint"
            label="设定"
            variant="outlined"
            class="my-4"
            hide-details="auto"
            placeholder="多个要点请用空格隔开"
        />
        <v-container>
            <v-row>
                <v-col cols="6">
                    <v-btn
                        size="x-large"
                        block
                        class="font-weight-bold"
                        text="生成病例"
                        :loading="isLoading"
                        @click="genCase"
                    >
                        <template #loader>
                            <v-progress-circular indeterminate color="white" class="mr-4" />
                            {{ modelResponseField }}
                        </template>
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <v-btn
                        block
                        size="x-large"
                        class="font-weight-bold"
                        text="读取病例"
                        :loading="isLoading"
                        @click="loadCase"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-data-table :items="items" />
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<script setup>
const items = ref([])
const stateStore = useStateStore()
const {
    selectedBook,
    selectedChapter,
    selectedSection,
    selectedSubsection,
    genCaseKeyPoint,
    modelResponseField,
} = storeToRefs(stateStore)
const supabase = useSupabaseClient()
// 生成新病例，清空病例、故事、测试
const newCase = useNewCase()
// 生成状态提示
const isLoading = ref(false)

const modelRouter = useModelRouter()
const simCaseStore = useSimCaseStore()
const promptStore = usePromptStore()

// 处理教科书、章节、节次、子节的匹配
const chapterStore = useChapterStore()
const { chapter } = storeToRefs(chapterStore)

const books = computed(() => {
    return ['任意', ...Object.keys(chapter.value)]
})

const chapters = computed(() => {
    return selectedBook.value == '任意'
        ? ['任意']
        : ['任意', ...Object.keys(chapter.value[selectedBook.value])]
})

const sections = computed(() => {
    return selectedChapter.value == '任意' ||
        chapter.value[selectedBook.value][selectedChapter.value] == {}
        ? ['任意']
        : ['任意', ...Object.keys(chapter.value[selectedBook.value][selectedChapter.value])]
})

const subsections = computed(() => {
    return selectedSection.value == '任意' ||
        chapter.value[selectedBook.value][selectedChapter.value][selectedSection.value] == []
        ? ['任意']
        : [
              '任意',
              ...chapter.value[selectedBook.value][selectedChapter.value][selectedSection.value],
          ]
})

function handleBookChange() {
    selectedChapter.value = '任意'
    selectedSection.value = '任意'
    selectedSubsection.value = '任意'
}

function handleChapterChange() {
    selectedSection.value = '任意'
    selectedSubsection.value = '任意'
}

function handleSectionChange() {
    selectedSubsection.value = '任意'
}

async function genCase() {
    newCase.deleteAll()
    isLoading.value = true
    const messages = [
        { role: 'system', content: promptStore.casePrompt },
        {
            role: 'user',
            content:
                '病例要点设定：\n' +
                selectedBook.value +
                '\n' +
                selectedChapter.value +
                '\n' +
                selectedSection.value +
                '\n' +
                selectedSubsection.value +
                '\n' +
                genCaseKeyPoint.value,
        },
    ]

    simCaseStore.updateSimCase(JSON.parse(await modelRouter.getCase(messages)))
    isLoading.value = false
}

async function loadCase() {
    const { data, error } = await supabase.from('simcases').select('*')
    if (error) {
        console.log(error)
    }
    items.value = data
}
</script>

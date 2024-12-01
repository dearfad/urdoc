<template>
    <v-expansion-panels class="pt-4">
        <v-expansion-panel title="生成病例">
            <v-expansion-panel-text>
                <v-sheet class="generateCaseContainer">
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
                        v-model="keyPoint"
                        label="要点"
                        variant="outlined"
                        class="my-4"
                        hide-details="auto"
                        @focus="handleFocus"
                        @blur="handleBlur"
                    />
                    <v-btn
                        size="x-large"
                        block
                        class="generateCaseBottom font-weight-bold"
                        text="生成病例"
                        :loading="isLoading"
                        @click="genCase"
                    >
                        <template #loader>
                            <v-progress-circular indeterminate color="white" class="mr-4" />
                            正在生成...{{ currentGenCaseField }}
                        </template>
                    </v-btn>
                </v-sheet>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup>
const selectedBook = ref('任意')
const selectedChapter = ref('任意')
const selectedSection = ref('任意')
const selectedSubsection = ref('任意')
const keyPoint = ref('')

const chapterStore = useChapterStore()
const { chapter } = storeToRefs(chapterStore)
const books = computed(() => {
    return ['任意', ...Object.keys(chapter.value)]
})

function handleBookChange() {
    selectedChapter.value = '任意'
    selectedSection.value = '任意'
    selectedSubsection.value = '任意'
}

const chapters = computed(() => {
    return selectedBook.value == '任意'
        ? ['任意']
        : ['任意', ...Object.keys(chapter.value[selectedBook.value])]
})
function handleChapterChange() {
    selectedSection.value = '任意'
    selectedSubsection.value = '任意'
}
const sections = computed(() => {
    return selectedChapter.value == '任意' ||
        chapter.value[selectedBook.value][selectedChapter.value] == {}
        ? ['任意']
        : ['任意', ...Object.keys(chapter.value[selectedBook.value][selectedChapter.value])]
})

function handleSectionChange() {
    selectedSubsection.value = '任意'
}

const subsections = computed(() => {
    return selectedSection.value == '任意' ||
        chapter.value[selectedBook.value][selectedChapter.value][selectedSection.value] == []
        ? ['任意']
        : [
              '任意',
              ...chapter.value[selectedBook.value][selectedChapter.value][selectedSection.value],
          ]
})

const isLoading = ref(false)

const bigModel = useBigModel()
const { message } = storeToRefs(bigModel)
const { getCase } = bigModel

// 全局病例
const caseStore = useCaseStore()
const { updateSimCaseJson } = caseStore

const promptStore = usePromptStore()
const { casePrompt } = storeToRefs(promptStore)

// 手机输入法遮挡滚动
const stateStore = useStateStore()
const { isInputFocused } = storeToRefs(stateStore)
const goTo = useGoTo()

watch(
    () => stateStore.isInputFocused,
    () => {
        setTimeout(() => {
            goTo('.generateCaseBottom', { container: '.generateCaseContainer' })
        }, 300)
    }
)

watch(selectedBook, () => {
    selectedChapter.value = '任意'
})

function handleFocus() {
    isInputFocused.value = true
}

function handleBlur() {
    isInputFocused.value = false
}

async function genCase() {
    isLoading.value = true
    const messages = [
        { role: 'system', content: casePrompt.value },
        {
            role: 'user',
            content:
                selectedBook.value +
                ',' +
                selectedChapter.value +
                ',' +
                selectedSection.value +
                ',' +
                selectedSubsection.value +
                ',' +
                keyPoint.value,
        },
    ]

    await getCase(messages)
    updateSimCaseJson(message.value)
    isLoading.value = false
}

const { currentGenCaseField } = storeToRefs(stateStore)
</script>

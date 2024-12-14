<template>
    <v-expansion-panels v-model="panelExpandState" class="pt-4">
        <v-expansion-panel title="生成病例" value="genCasePanel">
            <v-expansion-panel-text>
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
                            正在生成...{{ modelResponseField }}
                        </template>
                    </v-btn>
                </v-sheet>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup lang="ts">
const stateStore = useStateStore()
const {
    selectedBook,
    selectedChapter,
    selectedSection,
    selectedSubsection,
    genCaseKeyPoint,
    modelResponseField,
} = storeToRefs(stateStore)

// 生成新病例，清空病例、故事、测试
const newCase = useNewCase()
// 生成状态提示
const isLoading = ref(false)

const modelRouter = useModelRouter()
const simCaseStore = useSimCaseStore()
const promptStore = usePromptStore()

// 扩展面板打开状态，病例生成完毕改变状态
// 手机模式关闭面板，桌面模式保持不变
const panelExpandState = ref(['genCasePanel'])
const { mdAndUp } = useDisplay()

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
    const messages: MessagesArray = [
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
    // localStorage.setItem('simCase', JSON.stringify(simCaseStore.simCase))
    isLoading.value = false

    // 扩展面板，手机模式关闭，桌面模式不变
    if (!mdAndUp.value) {
        panelExpandState.value = ['']
    }
}
</script>

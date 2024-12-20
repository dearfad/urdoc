<template>
    <v-sheet class="d-flex flex-column">
        <CommonChapterSelector />
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
    </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
const {
    selectedBook,
    selectedChapter,
    selectedSection,
    selectedSubsection,
    caseTag,
    modelResponseField,
} = storeToRefs(stateStore)

// 生成新病例，清空病例、故事、测试
const newCase = useNewCase()
// 生成状态提示
const isLoading = ref(false)

const modelRouter = useModelRouter()
const simCaseStore = useSimCaseStore()
const promptStore = usePromptStore()

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
                caseTag.value,
        },
    ]

    simCaseStore.updateSimCase(JSON.parse(await modelRouter.getCase(messages)))
    isLoading.value = false
}
</script>

<template>
    <v-sheet class="d-flex flex-column">
        <CommonChapterSelector />
        <CommonModelSelector />
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

// 生成状态提示
const isLoading = ref(false)

const modelRouter = useModelRouter()
const caseStore = useCaseStore()
const promptStore = usePromptStore()

async function genCase() {
    // 重置状态
    caseStore.$reset()
    // 提示生成中
    isLoading.value = true
    // 构造prompt
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

    caseStore.caseContent = JSON.parse(await modelRouter.getCase(messages))
    isLoading.value = false
}
</script>

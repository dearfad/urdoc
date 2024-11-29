<template>
    <v-sheet class="generateCaseContainer pa-8">
        <v-select
            v-model="selectedBook"
            label="教科书"
            :items="['任意', ...books]"
            variant="outlined"
        />
        <v-select
            v-model="selectedChapter"
            label="章节"
            :items="bookChatpers[selectedBook]"
            variant="outlined"
        />
        <v-text-field
            v-model="keyPoint"
            label="要点"
            variant="outlined"
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
</template>

<script setup>
const selectedBook = ref('任意')
const selectedChapter = ref('任意')
const keyPoint = ref('')
const books = reactive(['外科学', '内科学', '妇科学', '儿科学', '神经病学'])

const constStore = useConstStore()
const { bookChatpers } = constStore

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
            content: selectedBook.value + ',' + selectedChapter.value + ',' + keyPoint.value,
        },
    ]

    await getCase(messages)
    updateSimCaseJson(message.value)
    isLoading.value = false
}

const { currentGenCaseField } = storeToRefs(stateStore)
</script>

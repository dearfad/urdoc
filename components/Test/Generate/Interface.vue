<template>
    <v-text-field v-model="genTestKeyPoint" label="设定" />
    <v-btn :loading="isLoading" block text="生成问题" @click="genTest">
        <template #loader>
            <v-progress-circular indeterminate color="white" class="mr-4" />
            正在生成...{{ currentGenTestField }}
        </template>
    </v-btn>
</template>

<script setup>
const isLoading = ref(false)
const promptStore = usePromptStore()
const { testPrompt } = storeToRefs(promptStore)
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)
const stateStore = useStateStore()
const { genTestKeyPoint, currentGenTestField } = storeToRefs(stateStore)
const bigModel = useBigModel()
const { getTest } = bigModel

const testStore = useTestStore()
const { fixTest } = testStore

async function genTest() {
    isLoading.value = true

    let markdown = ''
    for (const key in simCaseJson.value) {
        const value = simCaseJson.value[key]
        markdown += `**${key}**: ${value}\n`
    }
    const messages = [
        { role: 'system', content: testPrompt.value },
        {
            role: 'user',
            content: markdown + genTestKeyPoint.value,
        },
    ]

    await getTest(messages)
    fixTest()
    isLoading.value = false
}
</script>

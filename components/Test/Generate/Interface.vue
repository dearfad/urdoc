<template>
    <v-text-field v-model="keyPoint" label="设定" />
    <v-btn :loading="isLoading" @click="genTest">生成问题</v-btn>
</template>

<script setup>
const keyPoint = ref('执业医师考试')
const isLoading = ref(false)
const promptStore = usePromptStore()
const { testPrompt } = storeToRefs(promptStore)
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)

const bigModel = useBigModel()
const { getTest } = bigModel

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
            content: markdown + keyPoint.value,
        },
    ]

    await getTest(messages)
    isLoading.value = false
}
</script>

<template>
    <v-text-field v-model="keyPoint" label="设定" placeholder="真实" />
    <v-btn :loading="isLoading" block @click="genStory">生成故事</v-btn>
</template>

<script setup>
const keyPoint = ref('真实')
const isLoading = ref(false)
const promptStore = usePromptStore()
const { storyPrompt } = storeToRefs(promptStore)
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)

const bigModel = useBigModel()
const { getStory } = bigModel

async function genStory() {
    isLoading.value = true

    let markdown = ''
    for (const key in simCaseJson.value) {
        const value = simCaseJson.value[key]
        markdown += `**${key}**: ${value}\n`
    }
    const messages = [
        { role: 'system', content: storyPrompt.value },
        {
            role: 'user',
            content: markdown + keyPoint.value,
        },
    ]

    await getStory(messages)
    isLoading.value = false
}
</script>

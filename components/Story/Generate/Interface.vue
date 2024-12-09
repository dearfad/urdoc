<template>
    <v-text-field v-model="stateStore.genStoryKeyPoint" label="设定" placeholder="真实" />
    <v-btn :loading="isLoading" block @click="genStory">生成故事</v-btn>
</template>

<script setup>
const isLoading = ref(false)
const bigModel = useBigModel()
const promptStore = usePromptStore()
const stateStore = useStateStore()
const caseStore = useCaseStore()
const storyStore = useStoryStore()

async function genStory() {
    isLoading.value = true
    const messages = [
        { role: 'system', content: promptStore.storyPrompt },
        {
            role: 'user',
            content: caseStore.simCaseMarkdown + stateStore.genStoryKeyPoint,
        },
    ]
    storyStore.updateStory(await bigModel.getStory(messages))
    isLoading.value = false
}
</script>

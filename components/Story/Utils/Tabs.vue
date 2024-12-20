<template>
    <v-text-field v-model="stateStore.genStoryKeyPoint" label="设定" placeholder="真实" />
    <v-btn :loading="isLoading" block @click="genStory">生成故事</v-btn>
</template>

<script setup>
const isLoading = ref(false)
const bigModel = useBigModel()
const promptStore = usePromptStore()
const stateStore = useStateStore()
const simCaseStore = useSimCaseStore()
const simStoryStore = useSimStoryStore()

async function genStory() {
    isLoading.value = true
    const messages = [
        { role: 'system', content: promptStore.storyPrompt },
        {
            role: 'user',
            content: simCaseStore.simCaseMarkdown + stateStore.genStoryKeyPoint,
        },
    ]
    simStoryStore.updateSimStory(await bigModel.getStory(messages))
    isLoading.value = false
}
</script>

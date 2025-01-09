<template>
    <v-text-field v-model="caseStore.storyTag" label="设定" placeholder="真实" />
    <v-btn :loading="isLoading" block @click="getStory">生成故事</v-btn>
</template>

<script setup>
const caseStore = useCaseStore()
const promptStore = usePromptStore()
const modelRouter = useModelRouter()
const isLoading = ref(false)

async function getStory() {
    isLoading.value = true
    const messages = [
        { role: 'system', content: promptStore.storyPrompt },
        {
            role: 'user',
            content: caseStore.caseContentMarkdown + caseStore.storyTag,
        },
    ]
    caseStore.caseStory = await modelRouter.getStory(messages)
    isLoading.value = false
}
</script>

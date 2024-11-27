<template>
    <v-text-field v-model="keyPoint" label="设定" placeholder="真实" />
    <v-btn :loading="isLoading" @click="genStory">生成故事</v-btn>
</template>

<script setup>
const keyPoint = ref('真实')
const isLoading = ref(false)
const promptStore = usePromptStore()
const { storySysPrompt } = storeToRefs(promptStore)

const bigModel = useBigModel()
const { getStory } = bigModel

async function genStory() {
    isLoading.value = true
    const messages = [
        { role: 'system', content: storySysPrompt.value },
        {
            role: 'user',
            content: keyPoint.value,
        },
    ]

    await getStory(messages)
    isLoading.value = false
}
</script>

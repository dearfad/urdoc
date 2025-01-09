<template>
    <v-text-field v-model="caseStore.testTag" label="设定" />
    <v-btn :loading="isLoading" block text="生成问题" @click="getTest">
        <template #loader>
            <v-progress-circular indeterminate color="white" class="mr-4" />
            正在生成...{{ stateStore.modelResponseField }}
        </template>
    </v-btn>
</template>

<script setup>
const isLoading = ref(false)
const stateStore = useStateStore()
const promptStore = usePromptStore()
const caseStore = useCaseStore()
const modelRouter = useModelRouter()

async function getTest() {
    isLoading.value = true
    const messages = [
        { role: 'system', content: promptStore.testPrompt },
        {
            role: 'user',
            content: caseStore.caseContentMarkdown + caseStore.testTag,
        },
    ]
    caseStore.caseTest = JSON.parse(await modelRouter.getTest(messages))
    isLoading.value = false
}
</script>

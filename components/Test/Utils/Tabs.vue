<template>
    <v-text-field v-model="stateStore.genTestKeyPoint" label="设定" />
    <v-btn :loading="isLoading" block text="生成问题" @click="genTest">
        <template #loader>
            <v-progress-circular indeterminate color="white" class="mr-4" />
            正在生成...{{ stateStore.currentGenTestField }}
        </template>
    </v-btn>
</template>

<script setup>
const isLoading = ref(false)
const stateStore = useStateStore()

const promptStore = usePromptStore()
const caseStore = useCaseStore()
const bigModel = useBigModel()

const testStore = useTestStore()

async function genTest() {
    isLoading.value = true
    const messages = [
        { role: 'system', content: promptStore.testPrompt },
        {
            role: 'user',
            content: caseStore.simCaseMarkdown + stateStore.genTestKeyPoint,
        },
    ]
    testStore.updateTest(await bigModel.getTest(messages))
    console.log(testStore.test)
    isLoading.value = false
}
</script>

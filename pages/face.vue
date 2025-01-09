<template>
    <v-container class="text-center">
        <v-row>
            <v-col cols="12">
                <CommonCaseNavCard />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <h1>头像生成</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <FaceShow />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-btn :loading="isLoading" @click="getFace">生成头像</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const isLoading = ref(false)
const caseStore = useCaseStore()
const modelRouter = useModelRouter()

async function getFace() {
    isLoading.value = true
    caseStore.caseFace = await modelRouter.getFace()
    isLoading.value = false
}
</script>

<template>
    <ClientOnly>
        <v-container class="text-center">
            <v-row>
                <v-col />
                <v-col cols="12" md="6">
                    <v-sheet>
                        <FaceShow />
                        <v-sheet class="font-weight-bold text-h5 pt-4">
                            {{ caseStore.caseContent.姓名 }}
                        </v-sheet>
                    </v-sheet>
                </v-col>
                <v-col />
            </v-row>
            <v-row>
                <v-col />
                <v-col cols="12" md="8">
                    <v-btn :loading="isLoading" @click="nextCase">
                        下一位患者
                        <template #loader>
                            <v-progress-circular indeterminate color="white" class="mr-4" />
                            {{ stateStore.modelResponseField }}
                        </template>
                    </v-btn>
                </v-col>
                <v-col />
            </v-row>
        </v-container>
    </ClientOnly>
</template>

<script setup>
definePageMeta({
    title: '开诊',
})
const caseStore = useCaseStore()
const stateStore = useStateStore()
const isLoading = ref(false)
async function nextCase() {
    isLoading.value = true
    await caseStore.newCase()
    isLoading.value = false
}
</script>

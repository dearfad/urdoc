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
                <v-col cols="12" md="2">
                    <v-btn
                        size="x-large"
                        block
                        :disabled="isLoading"
                        :class="stateStore.isActing ? 'font-weight-bold' : 'font-weight-regular'"
                        @click=";(stateStore.isActing = true), (stateStore.isRating = false)"
                    >
                        开始问诊
                    </v-btn>
                </v-col>
                <v-col cols="12" md="2">
                    <v-btn
                        size="x-large"
                        block
                        :disabled="isLoading"
                        :class="stateStore.isRating ? 'font-weight-bold' : 'font-weight-regular'"
                        @click=";(stateStore.isActing = false), (stateStore.isRating = true)"
                    >
                        回答问题
                    </v-btn>
                </v-col>
                <v-col cols="12" md="2">
                    <v-btn
                        size="x-large"
                        block
                        class="font-weight-bold"
                        :loading="isLoading"
                        @click="nextCase"
                    >
                        下一位患者
                        <template #loader>
                            <v-progress-circular indeterminate color="white" class="mr-4" />
                            {{ stateStore.modelResponseField }}
                        </template>
                    </v-btn>
                </v-col>
                <v-col />
            </v-row>

            <v-row v-if="stateStore.isActing">
                <v-col />
                <v-col cols="12" md="6">
                    <ActContentShow />
                    <ActUtilsSend />
                </v-col>
                <v-col />
            </v-row>
            <v-row v-if="stateStore.isRating">
                <v-col />
                <v-col cols="12" md="6">
                    <RateContentShow />
                    <RateUtilsSend />
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

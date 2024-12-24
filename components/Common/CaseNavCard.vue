<template>
    <v-sheet elevation="2" class="ma-2">
        <v-sheet>
            <ClientOnly>
                <v-card
                    v-if="simCaseStore.simCase"
                    :title="simCaseStore.simCase.姓名"
                    :subtitle="simCaseStore.simCase.主诉"
                    prepend-icon="mdi-human-female"
                    variant="text"
                >
                    <template #append>
                        <v-chip v-if="stateStore.id" variant="elevated" size="small">病例库</v-chip>
                        <v-chip
                            v-if="stateStore.validated"
                            variant="elevated"
                            size="small"
                            color="green"
                            >已校验</v-chip
                        >
                    </template>
                    <v-card-text class="pb-0">
                        <CommonCaseTag />
                    </v-card-text>
                </v-card>
            </ClientOnly>
            <v-sheet class="pa-2">
                <v-btn text="病历" to="/case" variant="text" />
                <v-btn text="故事" variant="text" />
                <v-btn text="问题" variant="text" />
                <v-btn text="问诊" variant="text" />
                <v-btn text="评估" variant="text" />
            </v-sheet>
        </v-sheet>
    </v-sheet>
</template>

<script setup>
const simCaseStore = useSimCaseStore()
const stateStore = useStateStore()
</script>

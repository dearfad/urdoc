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
                />
            </ClientOnly>
            <v-sheet class="pa-2">
                <v-btn text="病历" to="/gencase" variant="text" />
                <v-btn text="故事" to="/genstory" variant="text" />
                <v-btn text="问题" to="/gentest" variant="text" />
                <v-btn text="问诊" to="/simpatient" variant="text" />
                <v-btn text="评估" to="/simask" variant="text" />
            </v-sheet>
        </v-sheet>
    </v-sheet>
</template>

<script setup>
const simCaseStore = useSimCaseStore()
</script>

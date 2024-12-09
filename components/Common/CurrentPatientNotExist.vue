<template>
    <v-banner v-if="!simCase" lines="one" icon="mdi-alert-box-outline" density="compact">
        <template #text>病例不存在，请前往<span class="font-weight-bold">生成病例</span></template>
        <template #actions
            ><v-btn
                icon="mdi-arrow-right-bold"
                to="/gencase"
                variant="plain"
                class="pb-1"
                color="green"
        /></template>
    </v-banner>
</template>

<script setup>
const caseStore = useCaseStore()
const { simCase } = storeToRefs(caseStore)
</script>

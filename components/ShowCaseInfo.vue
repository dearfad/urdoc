<template>
    <v-container> 姓名：{{ simCaseJson['姓名'] }}</v-container>
</template>

<script setup>
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)
</script>

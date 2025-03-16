<template>
    <v-sheet class="d-flex flex-column">
        <CommonCaseNavCard />
        <CaseContentShow />
        <CaseUtilsTabs />
    </v-sheet>
</template>

<script setup>
definePageMeta({
    title: '生成病例',
})
</script>

<template>
    <v-container>
        <v-row>
            <v-col />
            <v-col cols="12" md="8"> <CommonCaseNavCard /></v-col>
            <v-col />
        </v-row>
        <v-row>
            <v-col />
            <v-col cols="12" md="8"> <FaceShow /></v-col>
            <v-col />
        </v-row>
        <v-row>
            <v-col />
            <v-col cols="12" md="8"> <CaseContentShow /></v-col>
            <v-col />
        </v-row>
    </v-container>
</template>

<script setup>
definePageMeta({
    title: '开诊',
})
</script>

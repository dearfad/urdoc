<template>
    <v-card
        :title="simCaseJson['姓名']"
        :subtitle="simCaseJson['主诉']"
        prepend-icon="mdi-human-female"
    >
        <v-timeline direction="horizontal" side="end" density="compact">
            <v-timeline-item
                icon="mdi-wrench-outline"
                :dot-color="simCaseJson ? 'green' : 'grey'"
            />
            <v-timeline-item icon="mdi-book-open-outline" dot-color="grey" />
            <v-timeline-item icon="mdi-ab-testing" dot-color="grey" />
            <v-timeline-item icon="mdi-account-outline" dot-color="grey" />
            <v-timeline-item icon="mdi-shield-star-outline" dot-color="grey" />
        </v-timeline>
    </v-card>
</template>

<script setup>
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)
</script>

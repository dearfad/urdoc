<template>
    <v-container>
        <v-row v-if="simCaseJson">
            <v-col cols="12">
                <CommonCurrentPatient />
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="simCaseJson" cols="12" order="2" md="9" order-md="1"
                ><CaseShowDetail
            /></v-col>
            <v-col cols="12" order="1" md="3" order-md="2" class="mx-auto">
                <CaseGenerateInterface />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)
</script>

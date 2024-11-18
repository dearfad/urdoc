<template>
    <v-sheet class="overflow-auto">
        <v-list>
            <v-list-item v-for="(value, key, index) in simCaseJson" :key="index">
                <span class="font-weight-bold">{{ key }}：</span>{{ value }}
            </v-list-item>
        </v-list>
    </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)
</script>

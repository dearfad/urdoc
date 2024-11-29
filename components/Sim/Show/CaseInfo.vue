<template>
    <v-card
        :title="simCaseJson['姓名']"
        :subtitle="simCaseJson['主诉']"
        :loading="isLoading"
        color="blue-lighten-5"
        class="flex-shrink-0"
    >
        <template #prepend>
            <v-avatar color="blue-darken-2">
                <v-icon icon="mdi-human-female" />
            </v-avatar>
        </template>
    </v-card>
</template>

<script setup>
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)
const isLoading = ref(false)
</script>

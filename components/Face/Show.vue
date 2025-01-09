<template>
    <v-img width="200" min-height="200" class="mx-auto" :src="caseStore.caseFace" rounded="circle">
        <template #placeholder
            ><div v-if="caseStore.caseFace" class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate /></div
        ></template>
    </v-img>
</template>

<script setup>
const caseStore = useCaseStore()
</script>

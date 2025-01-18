<template>
    <v-img
        width="160"
        min-height="160"
        class="mx-auto"
        :src="caseStore.caseFace"
        rounded="circle"
        @click="showFace"
    >
        <template #placeholder
            ><div v-if="caseStore.caseFace" class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate /></div
        ></template>
    </v-img>
</template>

<script setup>
const caseStore = useCaseStore()
function showFace() {
    window.open(caseStore.caseFace, '_blank')
}
</script>

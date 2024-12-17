<template>
    <v-sheet class="border-thin text-body-1 pa-4 mx-2">
        <ClientOnly>
            <div v-if="!simCaseStore.simCaseMarkdown" class="pa-4">请生成病例！</div>
            <MDC :value="simCaseStore.simCaseMarkdown" />
        </ClientOnly>
    </v-sheet>
</template>

<script setup>
const simCaseStore = useSimCaseStore()
</script>

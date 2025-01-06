<template>
    <v-sheet class="border-thin text-body-1 pa-4 mx-2">
        <ClientOnly>
            <div v-if="!caseStore.caseContentMarkdown" class="pa-4">请生成病例！</div>
            <MDC :value="caseStore.caseContentMarkdown" />
        </ClientOnly>
    </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
</script>

<template>
    <v-sheet class="border-thin text-body-1 pa-4 mx-2">
        <ClientOnly>
            <div v-if="!caseStore.caseTestMarkdown" class="pa-4">请生成问题！</div>
            <MDC :value="caseStore.caseTestMarkdown" />
        </ClientOnly>
    </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
</script>

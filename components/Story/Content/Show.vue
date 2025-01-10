<template>
    <v-sheet class="border-thin text-body-1 pa-4 mx-2">
        <ClientOnly>
            <div v-if="!caseStore.caseStoryMarkdown" class="pa-4">请生成问题！</div>
            <MDC :value="caseStore.caseStoryMarkdown" />
        </ClientOnly>
    </v-sheet>
    <!-- <v-sheet>
        <ClientOnly>
            <v-textarea v-model="caseStore.caseStory" auto-grow variant="outlined" />
            <v-sheet class="my-2">
                <v-chip variant="text" class="px-1">标签:</v-chip>
                <span v-if="caseStore.storyTag != ''">
                    <v-chip
                        v-for="keyPoint in caseStore.storyTag.split(' ')"
                        :key="keyPoint"
                        variant="outlined"
                        class="ma-1"
                    >
                        {{ keyPoint }}
                    </v-chip>
                </span>
            </v-sheet>
        </ClientOnly>
    </v-sheet> -->
</template>

<script setup>
const caseStore = useCaseStore()
</script>

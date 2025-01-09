<template>
    <v-sheet>
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
    </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
</script>

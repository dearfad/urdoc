<template>
    <v-textarea v-model="simStoryStore.simStory" auto-grow variant="outlined" />
    <v-sheet class="my-2">
        <v-chip variant="text" class="px-1">标签:</v-chip>
        <span v-if="stateStore.genStoryKeyPoint != ''">
            <v-chip
                v-for="keyPoint in stateStore.genStoryKeyPoint.split(' ')"
                :key="keyPoint"
                variant="outlined"
                class="ma-1"
            >
                {{ keyPoint }}
            </v-chip>
        </span>
    </v-sheet>
</template>

<script setup>
const simStoryStore = useSimStoryStore()
const stateStore = useStateStore()
</script>

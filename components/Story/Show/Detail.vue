<template>
    <v-textarea v-model="story" readonly auto-grow variant="solo" />
    <v-sheet class="my-2">
        <v-chip variant="text" class="px-1">标签:</v-chip>
        <span v-if="genStoryKeyPoint != ''">
            <v-chip
                v-for="keyPoint in genStoryKeyPoint.split(' ')"
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
const storyStore = useStoryStore()
const { story } = storeToRefs(storyStore)
const stateStore = useStateStore()
const { genStoryKeyPoint } = storeToRefs(stateStore)
</script>

<template>
    <v-textarea v-model="story" readonly auto-grow variant="solo" />
</template>

<script setup>
const storyStore = useStoryStore()
const { story } = storeToRefs(storyStore)
</script>

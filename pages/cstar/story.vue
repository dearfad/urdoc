<template>
    <v-sheet class="d-flex flex-column">
        <CommonCaseNavCard />
        <StoryContentShow />
        <StoryUtilsCreate />
    </v-sheet>
</template>

<script setup>
definePageMeta({
    title: '编写故事',
})
</script>

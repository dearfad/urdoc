<template>
    <v-sheet class="d-flex">
        <v-select v-model="selectedBook" label="教科书" :items="book" direction="vertical" />
        <v-select v-model="selectedChapter" :items="chapter" direction="vertical" />
    </v-sheet>
</template>

<script setup>
const book = reactive(['外科学', '内科学', '妇科学', '儿科学', '神经病学'])
const chapter = reactive(['乳房疾病'])
const selectedBook = ref('')
const selectedChapter = ref('')
</script>

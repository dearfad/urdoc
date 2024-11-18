<template>
    <v-sheet class="d-flex flex-column justify-space-between h-screen pa-10">
        <v-select
            v-model="selectedBook"
            label="教科书"
            :items="book"
            class="flex-grow-0"
            variant="outlined"
        />
        <v-select
            v-model="selectedChapter"
            label="章节"
            :items="chapter"
            class="flex-grow-0"
            variant="outlined"
        />
        <v-text-field v-model="keyPoint" label="要点" class="flex-grow-0" variant="outlined" />
        <v-spacer />
        <v-btn size="x-large" class="font-weight-bold" text="生成病例" />
    </v-sheet>
</template>

<script setup>
const book = reactive(['外科学', '内科学', '妇科学', '儿科学', '神经病学'])
const chapter = reactive([
    '乳房疾病',
    '颈部疾病',
    '胃肠疾病',
    '麻醉',
    '水电解质紊乱',
    '肿瘤',
    '骨折',
])
const selectedBook = ref('')
const selectedChapter = ref('')
</script>

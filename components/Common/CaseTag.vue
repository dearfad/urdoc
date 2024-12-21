<template>
    <v-sheet>
        <v-chip v-if="id" variant="text" size="small"> ID：{{ id }} </v-chip>
        <v-chip v-if="selectedBook" variant="text" size="small">
            教科书：{{ selectedBook }}
        </v-chip>
        <v-chip v-if="selectedChapter" variant="text" size="small">
            章节：{{ selectedChapter }}
        </v-chip>
        <v-chip v-if="selectedSection" variant="text" size="small">
            节次：{{ selectedSection }}
        </v-chip>
        <v-chip v-if="selectedSubsection" variant="text" size="small">
            子节：{{ selectedSubsection }}
        </v-chip>
        <v-chip v-if="caseTag" variant="text" size="small"> 设定：{{ caseTag }} </v-chip>
    </v-sheet>
</template>

<script setup>
const stateStore = useStateStore()
const { selectedBook, selectedChapter, selectedSection, selectedSubsection, caseTag, id } =
    storeToRefs(stateStore)
</script>

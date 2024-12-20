<template>
    <v-textarea v-model="test" readonly auto-grow variant="solo" />
    {{ test }}
</template>

<script setup>
const testStore = useTestStore()
const { test } = storeToRefs(testStore)
</script>

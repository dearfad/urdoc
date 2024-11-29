<template>
    <v-textarea v-model="test" readonly auto-grow />
</template>

<script setup>
const testStore = useTestStore()
const { test } = storeToRefs(testStore)
</script>

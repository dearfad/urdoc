<template>
    <v-textarea
        v-if="stateStore.debug"
        v-model="stateStore.modelResponseString"
        label="模型响应解析"
        rows="1"
        auto-grow
        variant="outlined"
    />
    <v-textarea
        v-if="stateStore.debug"
        v-model="stateStore.modelResponseStream"
        label="模型响应流"
        rows="1"
        auto-grow
        variant="outlined"
    />
</template>

<script setup lang="ts">
const stateStore = useStateStore()
</script>

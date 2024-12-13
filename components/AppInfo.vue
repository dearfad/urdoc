<template>
    <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ stateStore.appInfo }}
        <template #actions>
            <v-btn variant="text" @click="snackbar = false"> 关闭 </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup lang="ts">
const snackbar = ref(false)
const timeout = ref(-1)
const stateStore = useStateStore()

watch(
    () => stateStore.appInfo,
    () => {
        snackbar.value = true
    }
)
</script>

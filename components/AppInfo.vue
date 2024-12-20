<template>
    <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ stateStore.appInfo }}
        <template #actions>
            <v-btn variant="text" @click="snackbarClose"> 关闭 </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup lang="ts">
const snackbar = ref(false)
const timeout = ref(-1)
const stateStore = useStateStore()
let isWatching = true
watch(
    () => stateStore.appInfo,
    () => {
        if (isWatching) {
            console.log(isWatching)
            console.log('appInfo changed')
            snackbar.value = true
        }
    },
    { immediate: false }
)

function snackbarClose() {
    snackbar.value = false
    isWatching = false
    console.log(isWatching)
    stateStore.appInfo = ''
    console.log(isWatching)
    isWatching = true
}
</script>

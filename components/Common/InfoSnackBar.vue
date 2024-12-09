<template>
    <v-snack-bar v-model="snackbar" timeout="2000">
        {{ globalInfo }}
    </v-snack-bar>
</template>

<script setup>
const snackbar = ref(false)
const stateStore = useStateStore()
const { globalInfo } = storeToRefs(stateStore)
watch(globalInfo, () => {
    if (globalInfo.value) {
        snackbar.value = true
    }
})
</script>

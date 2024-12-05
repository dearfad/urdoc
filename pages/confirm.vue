<template>
    <v-sheet>Waiting for login...</v-sheet>
</template>

<script setup>
const user = useSupabaseUser()

watch(
    user,
    () => {
        if (user.value) {
            // Redirect to protected page
            return navigateTo('/')
        }
    },
    { immediate: true }
)
</script>

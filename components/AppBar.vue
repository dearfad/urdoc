<template>
    <v-app-bar color="primary" density="compact">
        <template #prepend>
            <v-app-bar-nav-icon />
        </template>
        <v-app-bar-title class="font-weight-bold cursor-pointer" @click="routeToIndex">
            URDOC
        </v-app-bar-title>
        <v-spacer />
        <v-btn icon>
            <v-icon @click="routeToAbout">mdi-heart</v-icon>
        </v-btn>
        <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script setup>
const router = useRouter()
function routeToAbout() {
    router.push('/about')
}
function routeToIndex() {
    router.push('/')
}
</script>

<template>
    <v-app-bar color="primary" density="compact">
        <template #prepend>
            <v-app-bar-nav-icon />
        </template>
        <v-app-bar-title class="font-weight-bold cursor-pointer" @click="routeToIndex">
            URDOC
        </v-app-bar-title>
        <v-spacer />
        <v-btn @click="routeToGenCase">生成</v-btn>
        <v-btn @click="routeToSimPatient">问诊</v-btn>
        <v-btn>背景</v-btn>
        <v-btn>问题</v-btn>
        <v-btn>评估</v-btn>
    </v-app-bar>
</template>

<script setup>
const router = useRouter()

function routeToIndex() {
    router.push('/')
}
function routeToGenCase() {
    router.push('/gencase')
}
function routeToSimPatient() {
    router.push('/simpatient')
}
</script>

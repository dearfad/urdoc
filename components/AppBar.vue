<template>
    <v-app-bar color="primary" density="compact">
        <v-app-bar-nav-icon @click="isLeftNavDrawerShow = !isLeftNavDrawerShow" />
        <v-app-bar-title class="font-weight-bold cursor-pointer" @click="routeToIndex">
            URDOC
        </v-app-bar-title>
        <v-spacer />
        <v-btn @click="routeToIndex">首页</v-btn>
        <v-btn @click="routeToGuide">开始</v-btn>
    </v-app-bar>
    <!-- <v-navigation-drawer
        v-model="isLeftNavDrawerShow"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
    > -->
    <v-navigation-drawer v-model="isLeftNavDrawerShow" class="pa-4">
        <v-list-item
            prepend-icon="mdi-wrench-outline"
            class="font-weight-bold"
            @click="routeToGenCase"
            >生成病例</v-list-item
        >
        <v-list-item
            prepend-icon="mdi-account-injury-outline"
            class="font-weight-bold"
            @click="routeToSimPatient"
        >
            模拟问诊
        </v-list-item>
        <v-list-item prepend-icon="mdi-book-open-outline" class="font-weight-bold"
            >编写故事</v-list-item
        >
        <v-list-item prepend-icon="mdi-ab-testing" class="font-weight-bold">设计问题</v-list-item>
        <v-list-item prepend-icon="mdi-shield-star-outline" class="font-weight-bold"
            >评估能力</v-list-item
        >
    </v-navigation-drawer>
</template>

<script setup>
const isLeftNavDrawerShow = ref(false)
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

function routeToGuide() {
    router.push('/guide')
}
</script>

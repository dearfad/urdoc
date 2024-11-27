<template>
    <v-app-bar color="primary" density="compact">
        <v-app-bar-nav-icon @click="isLeftNavDrawerShow = !isLeftNavDrawerShow" />
        <v-app-bar-title class="font-weight-bold cursor-pointer"> URDOC </v-app-bar-title>
        <v-spacer />
        <v-btn to="/">首页</v-btn>
        <v-btn class="font-weight-bold" to="/guide" size="x-large">开诊</v-btn>
    </v-app-bar>
    <!-- 手机模式底部弹出 -->
    <!-- <v-navigation-drawer
        v-model="isLeftNavDrawerShow"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
    > -->
    <v-navigation-drawer v-model="isLeftNavDrawerShow" class="pa-4">
        <v-list-item prepend-icon="mdi-wrench-outline" class="font-weight-bold" to="/gencase"
            >生成病例</v-list-item
        >
        <v-list-item prepend-icon="mdi-book-open-outline" class="font-weight-bold"
            >编写故事</v-list-item
        >
        <v-list-item prepend-icon="mdi-ab-testing" class="font-weight-bold">设计问题</v-list-item>
        <v-list-item
            prepend-icon="mdi-account-injury-outline"
            class="font-weight-bold"
            to="/simpatient"
        >
            模拟问诊
        </v-list-item>
        <v-list-item prepend-icon="mdi-shield-star-outline" class="font-weight-bold"
            >评估能力</v-list-item
        >
    </v-navigation-drawer>
</template>

<script setup>
const isLeftNavDrawerShow = ref(false)
</script>

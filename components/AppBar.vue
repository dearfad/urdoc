<template>
    <v-app-bar elevation="0" density="compact">
        <v-app-bar-nav-icon @click="isLeftNavDrawerShow = !isLeftNavDrawerShow" />
        <v-app-bar-title class="font-weight-bold cursor-pointer" @click="router.push('/')">
            URDOC
        </v-app-bar-title>
        <v-spacer />
        <v-btn to="/guide">帮助</v-btn>
        <template #append>
            <v-btn icon="mdi-dots-vertical" @click="isRightNavDrawerShow = !isRightNavDrawerShow" />
        </template>
    </v-app-bar>
    <v-navigation-drawer v-model="isLeftNavDrawerShow" class="pa-4">
        <v-list>
            <v-list-item prepend-icon="mdi-arrow-down-circle" class="font-weight-bold">
                介绍
            </v-list-item>
            <v-list-item
                prepend-icon="mdi-timeline-question-outline"
                to="/guide"
                title="使用流程"
            />
            <v-divider />
            <v-list-item prepend-icon="mdi-arrow-down-circle" class="font-weight-bold">
                专题研究
            </v-list-item>
            <v-list-item prepend-icon="mdi-wrench-outline" to="/gencase" title="生成病例" />
            <v-list-item prepend-icon="mdi-book-open-outline" to="/genstory" title="编写故事" />
            <v-list-item prepend-icon="mdi-ab-testing" to="/gentest" title="设计问题" />
            <v-list-item prepend-icon="mdi-account-outline" to="/simpatient" title="模拟问诊" />
            <v-list-item prepend-icon="mdi-shield-star-outline" to="/simask" title="评估能力" />
            <v-divider />
            <v-list-item prepend-icon="mdi-account-details" class="font-weight-bold">
                个人中心
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer v-model="isRightNavDrawerShow" location="end" class="pa-4" rail>
        <v-btn to="/" icon="mdi-home" variant="plain" :ripple="false" />
        <v-btn
            icon="mdi-theme-light-dark"
            variant="plain"
            :ripple="false"
            @click="theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'"
        />
        <v-btn
            href="https://github.com/dearfad/urdoc"
            target="_blank"
            icon="mdi-github"
            variant="plain"
            :ripple="false"
        />
    </v-navigation-drawer>
</template>

<script setup>
const isLeftNavDrawerShow = ref(false)
const isRightNavDrawerShow = ref(false)
const theme = useTheme()
const router = useRouter()
</script>

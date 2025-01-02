<template>
    <v-app-bar density="compact" flat elevation="0">
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
    <v-navigation-drawer v-model="isLeftNavDrawerShow" class="pa-4" :disable-resize-watcher="true">
        <v-list nav>
            <v-list-item
                prepend-icon="mdi-account-injury-outline"
                class="font-weight-bold text-subtitle-2"
                to="/clinic"
            >
                开诊
            </v-list-item>
            <v-list-item
                prepend-icon="mdi-format-list-checkbox"
                class="font-weight-bold text-subtitle-2"
                to="/list"
            >
                浏览病例
            </v-list-item>
            <v-list-group>
                <template #activator="{ props }">
                    <v-list-item v-bind="props" prepend-icon="mdi-ballot-outline" density="compact">
                        <v-list-item-title class="font-weight-bold text-subtitle-2">
                            介绍
                        </v-list-item-title>
                    </v-list-item>
                </template>
                <v-list-item to="/guide" title="使用流程" density="compact" />
            </v-list-group>

            <v-list-group>
                <template #activator="{ props }">
                    <v-list-item
                        v-bind="props"
                        prepend-icon="mdi-flask-empty-outline"
                        density="compact"
                    >
                        <v-list-item-title class="font-weight-bold text-subtitle-2">
                            单项研究
                        </v-list-item-title>
                    </v-list-item>
                </template>
                <v-list-item to="/case" title="生成病例" />
                <v-list-item title="编写故事" />
                <v-list-item title="设计问题" />
                <v-list-item title="模拟问诊" />
                <v-list-item title="评估能力" />
            </v-list-group>
            <v-list-group>
                <template #activator="{ props }">
                    <v-list-item
                        v-bind="props"
                        prepend-icon="mdi-account-outline"
                        density="compact"
                    >
                        <v-list-item-title class="font-weight-bold text-subtitle-2">
                            个人中心
                        </v-list-item-title>
                    </v-list-item>
                </template>
                <v-list-item title="账号登录" to="/login" />
            </v-list-group>
        </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
        v-model="isRightNavDrawerShow"
        location="end"
        class="pa-4"
        :disable-resize-watcher="true"
        rail
    >
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
        <v-btn
            icon="mdi-bug-play-outline"
            variant="plain"
            :ripple="false"
            @click="stateStore.debug = !stateStore.debug"
        />
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
const isLeftNavDrawerShow = ref(false)
const isRightNavDrawerShow = ref(false)
const theme = useTheme()
const router = useRouter()
const stateStore = useStateStore()
</script>

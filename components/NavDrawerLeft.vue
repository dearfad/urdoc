<template>
    <v-navigation-drawer
        v-model="stateStore.isNavDrawerLeftShow"
        class="pa-4"
        :disable-resize-watcher="true"
    >
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
                <v-list-item to="/face" title="头像生成" />
                <v-list-item title="视频生成" />
                <v-list-item title="语音合成" />
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
</template>

<script setup>
const stateStore = useStateStore()
</script>

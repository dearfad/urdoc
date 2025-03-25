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
            <v-list-item-title class="font-weight-bold text-subtitle-2"> 介绍 </v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item to="/guide" title="使用流程" density="compact" />
      </v-list-group>

      <v-list-group>
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-flask-empty-outline" density="compact">
            <v-list-item-title class="font-weight-bold text-subtitle-2">
              单项研究
            </v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item to="/cstar/case" title="生成病例" />
        <v-list-item to="/cstar/story" title="编写故事" />
        <v-list-item to="/cstar/test" title="设计问题" />
        <v-list-item to="/cstar/act" title="模拟问诊" />
        <v-list-item to="/cstar/rate" title="评估能力" />
        <v-divider length="80" class="mx-13 my-2 border-opacity-30" thickness="1" />
        <v-list-item to="/media/face" title="头像生成" />
        <v-list-item to="/media/pose" title="视频生成" />
        <v-list-item title="语音合成" />
      </v-list-group>
      <v-list-group>
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-account-outline" density="compact">
            <v-list-item-title class="font-weight-bold text-subtitle-2">
              个人中心
            </v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item title="注册" to="/auth/register" />
        <v-list-item title="登录" to="/auth/login" />
        <v-list-item title="退出" to="/auth/logout" />
        <v-list-item title="资料" to="/user/profile" />
        <v-list-item title="改名" to="/user/update" />
        <v-list-item title="删除" to="/user/delete" />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
const stateStore = useStateStore()
</script>

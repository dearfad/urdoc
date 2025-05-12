<template>
  <v-navigation-drawer
    v-model="stateStore.isNavDrawerLeftShow"
    class="pa-4"
    location="left"
    :disable-resize-watcher="true"
  >
    <v-list nav>
      <!-- <v-list-item prepend-icon="mdi-account-injury-outline" class="font-weight-bold" to="/clinic">
        开诊
      </v-list-item>-->

      <v-list-group>
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-flask-empty-outline" density="compact">
            <v-list-item-title class="font-weight-bold text-subtitle-1">
              单项研究
            </v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item to="/cstar/case">
          <v-list-item-title class="text-subtitle-2"> 生成病例 </v-list-item-title>
        </v-list-item>
        <v-list-item to="/cstar/story">
          <v-list-item-title class="text-subtitle-2"> 编写故事 </v-list-item-title>
        </v-list-item>
        <v-list-item to="/cstar/test">
          <v-list-item-title class="text-subtitle-2"> 设计问题 </v-list-item-title>
        </v-list-item>
        <v-list-item to="/cstar/act">
          <v-list-item-title class="text-subtitle-2"> 模拟问诊 </v-list-item-title>
        </v-list-item>
        <v-list-item to="/cstar/rate">
          <v-list-item-title class="text-subtitle-2"> 评估能力 </v-list-item-title>
        </v-list-item>
        <!-- <v-divider length="80" class="mx-13 my-2 border-opacity-30" thickness="1" />
        <v-list-item to="/images/face">
          <v-list-item-title class="text-subtitle-2"> 头像生成 </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title class="text-subtitle-2"> 视频生成 </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title class="text-subtitle-2"> 语音合成 </v-list-item-title>
        </v-list-item>
      </v-list-group> -->
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
const stateStore = useStateStore()
</script>

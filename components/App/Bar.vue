<template>
  <v-app-bar flat density="compact">
    <v-app-bar-nav-icon @click="stateStore.isNavDrawerLeftShow = !stateStore.isNavDrawerLeftShow" />
    <v-app-bar-title class="font-weight-bold cursor-pointer" @click="router.push('/')">
      URDOC
    </v-app-bar-title>
    <v-spacer />
    <v-btn text="文档" to="/docs" />
    <v-btn v-if="!userStore.user.id" text="登录" to="/user/profile" />
    <v-btn v-else-if="userStore.user.name" :text="userStore.user.name" to="/user/profile" />
    <v-btn v-else :text="userStore.user.email" to="/user/profile" />
    <template #append>
      <v-btn
        icon="mdi-dots-vertical"
        @click="stateStore.isNavDrawerRightShow = !stateStore.isNavDrawerRightShow"
      />
    </template>
  </v-app-bar>
</template>

<script setup>
const router = useRouter()
const stateStore = useStateStore()
const userStore = useUserStore()
</script>

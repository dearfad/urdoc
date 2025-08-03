<template>
  <v-app-bar flat density="compact">
    <v-app-bar-nav-icon @click="stateStore.isNavDrawerLeftShow = !stateStore.isNavDrawerLeftShow" />
    <v-app-bar-title
      class="font-weight-bold cursor-pointer"
      text="URDOC"
      @click="router.push('/')"
    />
    <v-spacer />
    <v-btn text="文档" to="/docs" />
    <v-btn icon>
      <v-avatar color="primary" icon="mdi-account-circle" variant="outlined" size="x-small" />
      <v-menu activator="parent" origin="top">
        <v-list>
          <v-list-item append-icon="mdi-cog-outline" to="/user/profile">
            <v-list-item-title class="font-weight-bold text-subtitle-2">
              账号设置
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
    <v-btn
      v-tooltip="'主题'"
      icon="mdi-theme-light-dark"
      variant="plain"
      :ripple="false"
      @click="theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'"
    />
    <v-btn
      v-tooltip="'GitHub'"
      href="https://github.com/dearfad/urdoc"
      target="_blank"
      icon="mdi-github"
      variant="plain"
      :ripple="false"
    />
    <!-- <template #append>
      <v-btn
        icon="mdi-dots-vertical"
        @click="stateStore.isNavDrawerRightShow = !stateStore.isNavDrawerRightShow"
      />
    </template> -->
  </v-app-bar>
</template>

<script setup>
const router = useRouter()
const stateStore = useStateStore()
const theme = useTheme()
</script>

<style scoped>
:deep(.v-toolbar-title__placeholder) {
  overflow: visible;
}
</style>

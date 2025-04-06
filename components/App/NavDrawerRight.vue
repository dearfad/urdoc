<template>
  <v-navigation-drawer
    v-model="stateStore.isNavDrawerRightShow"
    location="end"
    class="pa-4"
    :disable-resize-watcher="true"
    rail
  >
    <v-btn v-tooltip="'首页'" to="/" icon="mdi-home" variant="plain" :ripple="false" />
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
    <v-btn
      v-tooltip="'debug'"
      icon="mdi-bug-play-outline"
      variant="plain"
      :ripple="false"
      @click="stateStore.isDebug = !stateStore.isDebug"
    />
    <v-btn
      v-tooltip="'底部导航'"
      icon="mdi-filter-variant"
      variant="plain"
      :ripple="false"
      @click="stateStore.isBottomNavigationShow = !stateStore.isBottomNavigationShow"
    />
    <v-btn
      v-tooltip="'镜像站点'"
      icon="mdi-sitemap-outline"
      variant="plain"
      :ripple="false"
      to="/site"
    />
  </v-navigation-drawer>
</template>

<script setup>
const theme = useTheme()
const stateStore = useStateStore()
</script>

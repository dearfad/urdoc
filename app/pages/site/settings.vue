<template>
  <v-container class="d-flex flex-column w-100 w-md-75 py-4 ga-4">
    <CommonApiBaseUrlSelector />
    <CommonSiteSelector />
    <!-- <v-btn
      v-tooltip="'debug'"
      icon="mdi-bug-play-outline"
      variant="plain"
      :ripple="false"
      @click="stateStore.isDebug = !stateStore.isDebug"
    />
    <v-btn
      v-tooltip="'开关底部导航'"
      icon="mdi-filter-variant"
      variant="plain"
      :ripple="false"
      @click="stateStore.isBottomNavigationShow = !stateStore.isBottomNavigationShow"
    />
    <v-btn
      v-tooltip="'开关应用页脚'"
      icon="mdi-format-vertical-align-bottom"
      variant="plain"
      :ripple="false"
      @click="stateStore.isAppFooterShow = !stateStore.isAppFooterShow"
    /> -->
  </v-container>
</template>

<script setup>
definePageMeta({
  title: '站点设置',
})
// const stateStore = useStateStore()
</script>

<template>
  <ClientOnly>
    <v-navigation-drawer
      v-model="stateStore.isNavDrawerRightShow"
      location="right"
      class="pa-4"
      :disable-resize-watcher="true"
      rail
    >
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
    </v-navigation-drawer>
  </ClientOnly>
</template>

<script setup>
const theme = useTheme()
const stateStore = useStateStore()
</script>

<template>
  <v-app>
    <AppBar />
    <AppNavDrawer />
    <AppFooter />
    <AppInfo />
    <v-main>
      <slot />
      <AppDebug />
    </v-main>
  </v-app>
</template>

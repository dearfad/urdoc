<template>
  <v-app>
    <AppBar />
    <AppNavDrawerLeft />
    <!-- <AppNavDrawerRight /> -->
    <AppFooter />
    <AppInfo />
    <v-main>
      <slot />
      <AppDebug />
    </v-main>
  </v-app>
</template>

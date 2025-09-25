<template>
  <v-app>
    <AppBar />
    <AppNavDrawer />
    <AppInfo />
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

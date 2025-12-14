<template>
  <v-app>
    <AppBar />
    <AppNavDrawer />
    <AppInfo />
    <v-main>
      <slot />
      <AppBottomNavigation />
    </v-main>
  </v-app>
</template>

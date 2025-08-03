<template>
  <v-app>
    <AppBar />
    <AppNavDrawer />
    <AppFooter />
    <AppInfo />
    <v-main>
      <slot />
      <AppDebug />
      <AppBottomNavigation />
    </v-main>
  </v-app>
</template>

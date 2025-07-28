<template>
  <v-app>
    <AppBar />
    <AppNavDrawerLeft />
    <AppNavDrawerRight />
    <AppFooter />
    <AppInfo />
    <v-main>
      <slot />
      <AppDebug />
      <AppBottomNavigation />
    </v-main>
  </v-app>
</template>

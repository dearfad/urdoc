<template>
  <v-app>
    <ClientOnly>
      <AppBar />
      <AppNavDrawerLeft />
      <AppNavDrawerRight />
    </ClientOnly>
    <AppFooter />
    <AppInfo />
    <v-main>
      <slot />
      <AppDebug />
      <AppBottomNavigation />
    </v-main>
  </v-app>
</template>

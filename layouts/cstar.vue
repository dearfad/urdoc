<template>
  <v-app>
    <ClientOnly>
      <AppBar />
      <AppNavDrawerLeft />
      <AppNavDrawerRight />
    </ClientOnly>
    <AppFooter />
    <AppInfo />
    <v-main class="pt-12 pb-9">
      <slot />
      <AppDebug />
      <AppBottomNavigation />
    </v-main>
  </v-app>
</template>

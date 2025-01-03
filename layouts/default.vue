<template>
    <v-app>
        <ClientOnly>
            <AppBar />
            <NavDrawerLeft />
            <NavDrawerRight />
        </ClientOnly>
        <AppFooter />
        <AppInfo />
        <v-main class="pt-12 pb-9">
            <slot />
            <AppDebug />
        </v-main>
    </v-app>
</template>

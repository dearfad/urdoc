<template>
    <v-app>
        <AppBar />
        <AppFooter />
        <AppInfo />
        <v-main>
            <slot />
            <AppDebug />
        </v-main>
    </v-app>
</template>

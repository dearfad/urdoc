<template>
    <v-navigation-drawer
        v-model="isRightNavDrawerShow"
        location="end"
        class="pa-4"
        :disable-resize-watcher="true"
        rail
    >
        <v-btn to="/" icon="mdi-home" variant="plain" :ripple="false" />
        <v-btn
            icon="mdi-theme-light-dark"
            variant="plain"
            :ripple="false"
            @click="theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'"
        />
        <v-btn
            href="https://github.com/dearfad/urdoc"
            target="_blank"
            icon="mdi-github"
            variant="plain"
            :ripple="false"
        />
        <v-btn
            icon="mdi-bug-play-outline"
            variant="plain"
            :ripple="false"
            @click="stateStore.debug = !stateStore.debug"
        />
    </v-navigation-drawer>
</template>

<script setup>
const theme = useTheme()
</script>

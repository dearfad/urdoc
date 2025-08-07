<template>
  <v-app-bar flat density="compact">
    <v-app-bar-nav-icon @click="toggleNavDrawer" />
    <v-app-bar-title
      class="font-weight-bold cursor-pointer"
      text="URDOC"
      @click="router.push('/')"
    />
    <v-spacer />

    <v-btn
      v-tooltip="'主题'"
      icon="mdi-theme-light-dark"
      variant="plain"
      :ripple="false"
      @click="toggleTheme"
    />
    <v-btn
      v-tooltip="'GitHub'"
      href="https://github.com/dearfad/urdoc"
      target="_blank"
      variant="plain"
      :ripple="false"
      icon="mdi-github"
    />
    <v-btn
      v-tooltip="'文档'"
      target="_blank"
      variant="plain"
      :ripple="false"
      icon="mdi-book-open-outline"
      to="/docs"
      aria-label="文档"
    />
    <div class="mx-2">
      <SignedOut>
        <SignInButton mode="modal"> <v-btn>登录</v-btn> </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  </v-app-bar>
</template>

<script setup>
const router = useRouter()
const stateStore = useStateStore()
const theme = useTheme()
const toggleNavDrawer = () => {
  stateStore.isNavDrawerShow = !stateStore.isNavDrawerShow
}
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<style scoped>
:deep(.v-toolbar-title__placeholder) {
  overflow: visible;
}
</style>

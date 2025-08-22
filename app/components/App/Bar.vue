<template>
  <v-app-bar flat density="compact">
    <v-app-bar-nav-icon @click="toggleNavDrawer" />
    <v-app-bar-title
      class="font-weight-bold cursor-pointer"
      text="URDOC"
      @click="router.push($localePath('index'))"
    />
    <v-spacer />
    <v-btn
      v-tooltip="'主题'"
      icon="mdi-theme-light-dark"
      variant="plain"
      :ripple="false"
      @click="theme.toggle()"
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
      href="https://urdoc.dearfad.com/docs"
      target="_blank"
      variant="plain"
      :ripple="false"
      icon="mdi-file-document-outline"
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
</script>

<style scoped>
/* 解决网站标题被截断的问题 */
:deep(.v-toolbar-title__placeholder) {
  overflow: visible;
}
</style>

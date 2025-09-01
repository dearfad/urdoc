<template>
  <v-app-bar flat density="compact">
    <v-app-bar-nav-icon @click="toggleNavDrawer" />
    <v-app-bar-title
      class="font-weight-bold cursor-pointer"
      text="URDOC"
      @click="router.push('/')"
    />
    <v-spacer />
    <div v-if="mdAndUp">
      <v-btn
        v-tooltip="$t('app.bar.theme')"
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
        v-tooltip="$t('app.bar.documents')"
        href="https://urdoc.dearfad.com/docs"
        target="_blank"
        variant="plain"
        :ripple="false"
        icon="mdi-file-document-outline"
      />
      <v-btn
        v-tooltip="$t('app.bar.language')"
        icon="mdi-translate"
        variant="plain"
        :ripple="false"
        @click="toggleLocale()"
      />
    </div>
    <div v-else>
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-horizontal" v-bind="props" />
        </template>
        <v-list slim>
          <v-list-item
            prepend-icon="mdi-theme-light-dark"
            :title="$t('app.bar.theme')"
            @click="theme.toggle()"
          />
          <v-list-item
            prepend-icon="mdi-github"
            title="GitHub"
            href="https://github.com/dearfad/urdoc"
            target="_blank"
          />
          <v-list-item
            prepend-icon="mdi-file-document-outline"
            :title="$t('app.bar.documents')"
            href="https://urdoc.dearfad.com/docs"
            target="_blank"
          />
          <v-list-item
            prepend-icon="mdi-translate"
            :title="$t('app.bar.language')"
            @click="toggleLocale()"
          />
        </v-list>
      </v-menu>
    </div>
    <div :key="clerkKey" class="mx-2">
      <SignedOut>
        <SignInButton mode="modal">
          <v-btn>{{ $t('app.bar.sign-in') }}</v-btn>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  </v-app-bar>
</template>

<script setup>
import { updateClerkOptions } from '@clerk/vue'
import { zhCN, enUS } from '@clerk/localizations'
const router = useRouter()
const stateStore = useStateStore()
const theme = useTheme()
const { mdAndUp } = useDisplay()
const { locale, setLocale } = useI18n()
const clerkKey = ref(locale.value)

const toggleNavDrawer = () => {
  stateStore.isNavDrawerShow = !stateStore.isNavDrawerShow
}

const toggleLocale = () => {
  const newLocale = locale.value === 'zh' ? 'en' : 'zh'
  setLocale(newLocale)
  updateClerkOptions({
    localization: newLocale === 'zh' ? zhCN : enUS,
  })
  clerkKey.value = newLocale
}
</script>

<style scoped>
/* 解决网站标题被截断的问题 */
:deep(.v-toolbar-title__placeholder) {
  overflow: visible;
}
</style>

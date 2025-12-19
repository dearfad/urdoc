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
        :icon="mdiThemeLightDark"
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
        :icon="mdiGithub"
      />
      <v-btn
        v-tooltip="$t('app.bar.documents')"
        href="https://urdoc.dearfad.com/docs"
        target="_blank"
        variant="plain"
        :ripple="false"
        :icon="mdiFileDocumentOutline"
      />
      <v-btn
        v-tooltip="$t('app.bar.language')"
        :icon="mdiTranslate"
        variant="plain"
        :ripple="false"
        @click="toggleLocale()"
      />
    </div>
    <div v-else>
      <v-menu>
        <template #activator="{ props }">
          <v-btn :icon="mdiDotsHorizontal" v-bind="props" />
        </template>
        <v-list slim>
          <v-list-item
            :prepend-icon="mdiThemeLightDark"
            :title="$t('app.bar.theme')"
            @click="theme.toggle()"
          />
          <v-list-item
            :prepend-icon="mdiGithub"
            title="GitHub"
            href="https://github.com/dearfad/urdoc"
            target="_blank"
          />
          <v-list-item
            :prepend-icon="mdiFileDocumentOutline"
            :title="$t('app.bar.documents')"
            href="https://urdoc.dearfad.com/docs"
            target="_blank"
          />
          <v-list-item
            :prepend-icon="mdiTranslate"
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
import {
  mdiThemeLightDark,
  mdiGithub,
  mdiFileDocumentOutline,
  mdiTranslate,
  mdiDotsHorizontal,
} from '@mdi/js'
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

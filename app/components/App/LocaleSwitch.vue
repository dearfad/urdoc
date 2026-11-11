<template>
  <UDropdownMenu :items="items">
    <UButton
      :aria-label="t('locale.switch')"
      :class="['cursor-pointer', buttonClass]"
      :size="size ?? 'lg'"
      icon="i-lucide-languages"
      color="neutral"
      variant="ghost"
    />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  buttonClass?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>()

const DEFAULT_LOCALE = 'zh'
/** 与 nuxt.config.ts 中 detectBrowserLanguage.cookieKey 保持一致 */
const LOCALE_COOKIE_KEY = 'i18n_redirected'

const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()

const items = computed<DropdownMenuItem[][]>(() => [
  [
    { label: t('locale.label'), type: 'label' },
    ...(locales.value as { code: string }[]).map((item) => ({
      label: t(`locale.${item.code}`),
      icon: item.code === locale.value ? 'i-lucide-check' : undefined,
      onSelect: () => switchTo(item.code),
    })),
  ],
])

/** 整页导航，让服务端按新 URL 重新解析语言，避免客户端残留的 locale 状态把路径改回去 */
function switchTo(code: string) {
  // alwaysRedirect 以 cookie 值为准，整页跳转前同步落盘，避免下次访问被旧值改写
  document.cookie = `${LOCALE_COOKIE_KEY}=${code}; Path=/; Max-Age=31536000; SameSite=Lax`
  if (code === locale.value) return

  const candidate = switchLocalePath(code)
  const keepsWrongPrefix = code === DEFAULT_LOCALE && /^\/[a-z]{2}(?=[/?#]|$)/.test(candidate)
  const target = candidate && !keepsWrongPrefix ? candidate : fallbackLocalePath(code)
  navigateTo(target, { external: true })
}

/** switchLocalePath 在个别路由下可能返回空，按 prefix_except_default 规则构造目标路径 */
function fallbackLocalePath(code: string) {
  const base = route.fullPath.replace(/^\/[a-z]{2}(?=[/?#]|$)/, '') || '/'
  return code === DEFAULT_LOCALE ? base : `/${code}${base === '/' ? '' : base}`
}
</script>

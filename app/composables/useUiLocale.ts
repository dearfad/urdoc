import { en, zh_cn } from '@nuxt/ui/locale'
import { useI18n } from 'vue-i18n'

/** 把 i18n 语言代码映射为 Nuxt UI 语言包与 HTML 语言标记 */
export function useUiLocale() {
  const { locale } = useI18n()

  const uiLocale = computed(() => (locale.value === 'en' ? en : zh_cn))
  const lang = computed(() => (locale.value === 'en' ? 'en-US' : 'zh-CN'))

  return { uiLocale, lang }
}

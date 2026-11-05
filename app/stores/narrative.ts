// 默认值变更后提升版本号，使旧的本地设定失效并重新应用默认值
const VERSION = '2026-11-05b'

// 默认仅生成并显示病例与故事，其余内容由用户在设定卡片中按需开启
function createFlags(): NarrativeFlags {
  return {
    case: true,
    story: true,
    conversation: false,
    discussion: false,
    comment: false,
    avatar: false,
    illustration: false,
  }
}

export const useNarrativeStore = defineStore('narrative', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:narrative')

  // 是否生成：决定「生成叙事」流程中实际执行哪些步骤
  const generate = ref<NarrativeFlags>(createFlags())
  // 是否显示：决定叙事单页中各区块与图像的可见性（同时影响截屏结果）
  const show = ref<NarrativeFlags>(createFlags())

  function setAll(kind: NarrativeSettingKind, value: boolean) {
    const flags = kind === 'generate' ? generate.value : show.value
    for (const key of Object.keys(flags) as NarrativeSectionKey[]) {
      flags[key] = value
    }
  }

  function restoreDefaults() {
    generate.value = createFlags()
    show.value = createFlags()
  }

  return {
    version,
    generate,
    show,
    setAll,
    restoreDefaults,
  }
})

import { DEFAULT_NARRATIVE_TEMPLATE_ID, resolveNarrativeTemplate } from '~/utils/narrativeTemplates'

// 默认值变更后提升版本号，使旧的本地设定失效并重新应用默认值。
// 2026-11-08a：新增 templateId。syncStoreVersion 版本不一致会清除整个 pinia:narrative，
// 用户的 generate/show 设定会被重置一次，属于预期的一次性迁移。
const VERSION = '2026-11-08a'

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
  // 当前显示模板：只影响视觉，不参与生成计划与区块显隐
  const templateId = ref<string>(DEFAULT_NARRATIVE_TEMPLATE_ID)

  function setAll(kind: NarrativeSettingKind, value: boolean) {
    const flags = kind === 'generate' ? generate.value : show.value
    for (const key of Object.keys(flags) as NarrativeSectionKey[]) {
      flags[key] = value
    }
  }

  // 仅恢复「生成 / 显示」设定；模板是独立的显示偏好，不随之重置
  function restoreDefaults() {
    generate.value = createFlags()
    show.value = createFlags()
  }

  // 写入前解析，避免把无效 id 持久化
  function setTemplate(id: string) {
    templateId.value = resolveNarrativeTemplate(id).id
  }

  return {
    version,
    generate,
    show,
    templateId,
    setAll,
    restoreDefaults,
    setTemplate,
  }
})

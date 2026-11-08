import type { NarrativeFlags, NarrativeSheetData } from '~/types/narrative'

// 叙事单页的纯视图数据层：汇聚各业务 store 的数据，产出与视觉无关的 props。
// 模板切换只改变 #nm-sheet 上的一个属性，不进入这里的任何 computed 依赖链。
export function useNarrativeViewModel() {
  const caseStore = useCaseStore()
  const stateStore = useStateStore()
  const imageStore = useImageStore()
  const storyStore = useStoryStore()
  const narrativeStore = useNarrativeStore()

  // 设定弹窗开关：生成计划为空时由生成器请求打开
  const isSettingsOpen = ref(false)

  // 疾病设定输入框与 Settings.vue 的「自定义内容」（stateStore.case.custom）关联：
  // 以「疾病：」前缀标记，双向同步——输入框内容会进入自定义列表，Settings 中编辑亦会回显
  const disease = computed({
    get: () => stateStore.case.custom.find((c) => c.startsWith(NARRATIVE_DISEASE_TAG))?.slice(NARRATIVE_DISEASE_TAG.length) ?? '',
    set: (val: string) => {
      const list = stateStore.case.custom.filter((c) => !c.startsWith(NARRATIVE_DISEASE_TAG))
      if (val && val.trim()) list.unshift(NARRATIVE_DISEASE_TAG + val.trim())
      stateStore.case.custom = list
    },
  })

  // 生成计划：各项目独立开关，实际执行顺序由 record 的设定顺序决定
  const generatePlan = computed<NarrativeFlags>(() => {
    const g = narrativeStore.generate
    return {
      case: !!g.case,
      story: !!g.story,
      conversation: !!g.conversation,
      discussion: !!g.discussion,
      comment: !!g.comment,
      avatar: !!g.avatar,
      illustration: !!g.illustration,
    }
  })

  // 显示计划：头像依附病例卡片，插图依附故事卡片
  const showPlan = computed<NarrativeFlags>(() => {
    const s = narrativeStore.show
    return {
      case: !!s.case,
      story: !!s.story,
      conversation: !!s.conversation,
      discussion: !!s.discussion,
      comment: !!s.comment,
      avatar: !!s.case && !!s.avatar,
      illustration: !!s.story && !!s.illustration,
    }
  })

  const generator = useNarrativeGenerator({
    getDisease: () => disease.value.trim(),
    getGeneratePlan: () => generatePlan.value,
    onEmptyPlan: () => {
      isSettingsOpen.value = true
    },
  })

  // 刊头大字始终使用病例的诊断名称；仅对显示做清理，保持「诊断」原值不变：
  // 去掉开头非文字符号，并在第一个非文字符号处截断，使疾病名称整洁
  const diseaseName = computed(() => cleanDiseaseName(caseStore.case.content?.诊断))

  // 清理疾病名称：
  // 1) 去除所有空格；2) 去除开头的序号/编号（可连续，如 1、 2. 3) ①② （一）（1）三、）；
  // 3) 去掉首部其余非文字符号；4) 遇到第一个非文字符号即截断（含该符号及其以后文字）
  function cleanDiseaseName(raw: unknown): string {
    let s = String(raw ?? '').replace(/\s+/g, '') // 去除所有空格（含中文/英文空格、换行等）
    if (!s) return ''

    // 去除开头的序号/编号（循环以处理连续出现的多个前缀）
    const reNum = /^([0-9]+[.、)）]|[①-⑳㉑-㉟]|[（(][0-9一二三四五六七八九十]+[)）]|[一二三四五六七八九十百千]+[.、])/
    let prev = s
    do {
      prev = s
      s = s.replace(reNum, '')
    } while (s !== prev && s.length > 0)

    // 定位首个文字字符（中文、字母、数字），去掉其前的所有符号
    const start = s.search(/[一-龥A-Za-z0-9]/)
    if (start === -1) return ''
    const body = s.slice(start)
    // 首个非文字符号处截断，去掉该符号及其之后所有内容
    const end = body.search(/[^一-龥A-Za-z0-9]/)
    return end === -1 ? body : body.slice(0, end)
  }

  // 病例内容字段列表（过滤空值），用于替换占位文字
  const caseEntries = computed<[string, string][]>(() => {
    const content = caseStore.case.content
    if (!content || typeof content === 'string') return []
    return Object.entries(content).filter(([, value]) => value !== undefined && value !== null && value !== '') as [
      string,
      string,
    ][]
  })

  // 头部字段（姓名、性别、年龄、主诉），各自成行，置于头像左侧
  const caseHeaders = computed<[string, string][]>(() =>
    NARRATIVE_CASE_HEADER_KEYS.map(
      (key) => [key, caseStore.case.content?.[key] ?? ''] as [string, string],
    ).filter(([, value]) => value !== ''),
  )
  // 其余字段（排除 姓名/性别/年龄/主诉）
  const caseOthers = computed<[string, string][]>(() =>
    caseEntries.value.filter(([key]) => !NARRATIVE_CASE_HEADER_KEYS.includes(key)),
  )

  // 患者头像：优先使用已生成的图像，否则按性别回退到占位图
  const avatarSrc = computed(() => {
    const generated = imageStore.faceImages[0]?.url
    if (generated) return generated
    const gender = caseStore.case.content?.性别
    if (gender && /男/.test(gender)) return '/images/placeholder_male.png'
    return '/images/placeholder_female.png'
  })

  // 生成插图过程中，尚未开始生成的占位框数量（不含当前正在生成的一张）
  const pendingIllustrations = computed(() => {
    if (!generator.isIllustrationGenerating.value) return 0
    return Math.max(0, 4 - imageStore.illustrationImages.length - 1)
  })

  const data = computed<NarrativeSheetData>(() => ({
    diseaseName: diseaseName.value,
    show: showPlan.value,
    hasCase: caseEntries.value.length > 0,
    caseHeaders: caseHeaders.value,
    caseOthers: caseOthers.value,
    patientName: caseStore.case.content?.姓名 ?? '患者',
    avatarSrc: avatarSrc.value,
    isAvatarGenerating: generator.isAvatarGenerating.value,
    storyContent: storyStore.story.content ?? '',
    conversationContent: storyStore.conversation.content ?? '',
    discussionContent: storyStore.discussion.content ?? '',
    commentContent: storyStore.comment.content ?? '',
    generatingSection: generator.generatingSection.value,
    illustrationImages: imageStore.illustrationImages,
    isIllustrationGenerating: generator.isIllustrationGenerating.value,
    pendingIllustrations: pendingIllustrations.value,
  }))

  return {
    disease,
    data,
    generatePlan,
    showPlan,
    isSettingsOpen,
    isGenerating: generator.isGenerating,
    generateNarrative: generator.generateNarrative,
  }
}

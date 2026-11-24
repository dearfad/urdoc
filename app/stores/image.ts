import { DefaultChatTransport, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { useI18n } from 'vue-i18n'
import type { ContextSectionInput } from '~/utils/context'
import { safeParseJson } from '~/utils/json'

const VERSION = '2026-11-24'
const SCENE_COUNT = 4

// 解析第一步输出：优先 JSON 字符串数组，其次引号列表，最后按句子切分；不足 4 段时循环补足
function parseIllustrationScenes(text: string): string[] {
  const cleaned = text.trim()
  if (!cleaned) return []

  let scenes: string[] = []
  const parsed = safeParseJson(cleaned)
  if (Array.isArray(parsed)) {
    scenes = parsed.filter((v): v is string => typeof v === 'string' && !!v.trim()).map((v) => v.trim())
  }
  if (!scenes.length) {
    scenes = (cleaned.match(/['"][^'"]*['"]/g) ?? []).map((m) => m.slice(1, -1).trim()).filter((v) => !!v)
  }
  if (!scenes.length) {
    scenes = cleaned
      .split(/[。！？\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 8)
  }
  if (!scenes.length) return []

  const base = [...scenes]
  while (scenes.length < SCENE_COUNT) scenes.push(base[scenes.length % base.length])
  return scenes.slice(0, SCENE_COUNT)
}

// 界面语言到提示词输出语言的映射：zh→中文、en→English，其他语言交由模型按模板规则推断
const PROMPT_LANGUAGE_BY_LOCALE: Record<string, string> = {
  zh: '中文',
  en: 'English',
}

// 界面语言到患者人种的映射，人种描述需与提示词输出语言一致
const ETHNICITY_BY_LOCALE: Record<string, string> = {
  zh: '中国人',
  en: 'American',
}

function resolvePromptLanguage(locale: string): string {
  return PROMPT_LANGUAGE_BY_LOCALE[locale] ?? locale
}

function resolveEthnicity(locale: string): string {
  return ETHNICITY_BY_LOCALE[locale] ?? '该语言对应地区的典型人种'
}

// store 的 action 脱离组件 setup，优先用 useI18n，取不到时再尝试 nuxtApp，最终回退中文
function resolveLocale(): string {
  try {
    return useI18n().locale.value
  } catch {
    try {
      return (useNuxtApp() as any).$i18n?.locale?.value ?? 'zh'
    } catch {
      return 'zh'
    }
  }
}

// store action 中安全读取 i18n 文案，取不到时回退中文
function translateImage(key: string, fallback: string): string {
  try {
    const value = useI18n().t(key)
    return value === key ? fallback : String(value)
  } catch {
    return fallback
  }
}

// 仅头像任务需要按界面语言注入输出语言与人种约束；追加在公共上下文指令之后，不影响其他任务
function buildFaceInstructions(baseInstructions: string): string {
  const locale = resolveLocale()
  const promptLanguage = resolvePromptLanguage(locale)
  const ethnicity = resolveEthnicity(locale)
  const runtime = [
    '## 语言与人种约束（本次生成必须遵守）',
    `当前界面语言：${locale}`,
    `提示词输出语言：${promptLanguage}。请用该语言输出提示词，覆盖基础提示词中任何关于短语语言的规定；人种与各维度描述均使用该语言，不要中英混杂。`,
    `患者人种：${ethnicity}。请依据基础提示词的语言与人种规则，将该人种自然融入「主体身份」维度描述。`,
  ].join('\n')
  return `${baseInstructions}\n\n${runtime}`
}

type ImageTask = 'face' | 'illustration' | 'generate'
// scene：第一步生成关键情节描述；prompt：第二步逐段生成详细文生图提示词；image：第三步生图
type Phase = 'idle' | 'scene' | 'prompt' | 'image'

interface StreamPromptOptions {
  type: 'face' | 'illustration'
  task: string
  extra?: ContextSectionInput[]
}

export const useImageStore = defineStore('image', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:image')

  const prompt = ref('')

  // 按任务类型分别保存 originalUrls（远程 URL，体积小），避免头像与插图相互覆盖。
  // images 由 originalUrls 派生为 { url, prompt }，不持久化 base64 data URL，
  // 否则多张 base64 极易超出 localStorage 配额，导致刷新后数据丢失。
  const generateOriginalUrls = ref<string[]>([])
  const faceOriginalUrls = ref<string[]>([])
  const illustrationOriginalUrls = ref<string[]>([])

  // 生成每张图片时实际使用的提示词，与 originalUrls 一一对应
  const generatePrompts = ref<string[]>([])
  const facePrompts = ref<string[]>([])
  const illustrationPrompts = ref<string[]>([])

  // 三步流水线的中间产物：关键情节描述（原文 + 4 段）、详细文生图提示词（当前流式 + 4 条）
  const facePromptText = ref('')
  const illustrationSceneText = ref('')
  const illustrationScenes = ref<string[]>([])
  const illustrationDetailText = ref('')
  const illustrationDetailPrompts = ref<string[]>([])

  // 运行时阶段与任务：仅以 computed 对外暴露，避免刷新后停留在「生成中」
  const phase = ref<Phase>('idle')
  const activeTask = ref<ImageTask | ''>('')

  function withPrompts(urls: string[], prompts: string[]) {
    const list = Array.isArray(urls) ? urls : []
    const texts = Array.isArray(prompts) ? prompts : []
    return list.map((url, i) => ({ url, prompt: texts[i] ?? '' }))
  }

  const generateImages = computed(() => withPrompts(generateOriginalUrls.value, generatePrompts.value))
  const faceImages = computed(() => withPrompts(faceOriginalUrls.value, facePrompts.value))
  const illustrationImages = computed(() => withPrompts(illustrationOriginalUrls.value, illustrationPrompts.value))

  const imageApi = useImageApi()

  const error = computed(() => imageApi.error.value)

  const chat = new Chat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onError: (err) => {
      useStateStore().toast.add({
        title: '生成失败',
        description: err.message,
        color: 'error',
        icon: 'i-lucide-alert-circle',
      })
    },
  })

  // 流式接收模型输出，实时更新对应的中间产物区域，结束后保留最终文本
  watch(
    () => [...(chat.lastMessage?.parts ?? [])],
    (parts) => {
      if (chat.lastMessage?.role !== 'assistant') return
      const text = parts
        .filter(isTextUIPart)
        .map((part) => part.text)
        .join('')
      if (activeTask.value === 'face') facePromptText.value = text
      if (activeTask.value === 'illustration') {
        if (phase.value === 'scene') illustrationSceneText.value = text
        if (phase.value === 'prompt') illustrationDetailText.value = text
      }
    },
  )

  const status = computed(() => (phase.value === 'idle' ? 'ready' : 'streaming'))
  const isGenerating = computed(() => phase.value !== 'idle')
  const currentPhase = computed(() => phase.value)
  const currentTask = computed(() => activeTask.value)

  function finish() {
    phase.value = 'idle'
    activeTask.value = ''
  }

  function reset() {
    imageApi.reset()
    chat.stop()
    chat.messages = []
    prompt.value = ''
    generateOriginalUrls.value = []
    faceOriginalUrls.value = []
    illustrationOriginalUrls.value = []
    generatePrompts.value = []
    facePrompts.value = []
    illustrationPrompts.value = []
    facePromptText.value = ''
    illustrationSceneText.value = ''
    illustrationScenes.value = []
    illustrationDetailText.value = ''
    illustrationDetailPrompts.value = []
    finish()
  }

  // 流式生成文本：按 type/task 选择对应提示词模板，extra 注入本次专属输入，结束后返回完整文本
  async function streamPrompt(options: StreamPromptOptions): Promise<string> {
    const context = await buildGenerationContext({
      type: options.type,
      task: options.task,
      target: 'image',
      extra: options.extra,
    })
    const model = useModelStore().activeModels.chat
    if (chat.status === 'error') chat.clearError()
    chat.stop()
    // 每次生成都从干净的单轮对话开始，避免历史提示词影响本次结果
    chat.messages = []
    await chat.sendMessage(
      { text: context.text },
      {
        body: {
          type: options.type,
          task: options.task,
          model,
          instructions: options.type === 'face' ? buildFaceInstructions(context.instructions) : context.instructions,
          providerOptions: useProviderStore().getProviderOptions(model.provider, false),
          template: getChatTemplate(model),
        },
      },
    )
    // 直接读取流的最终消息，避免 watch 异步刷新导致末尾文本丢失
    const parts = chat.lastMessage?.parts ?? []
    const text = parts
      .filter(isTextUIPart)
      .map((part) => part.text)
      .join('')
      .trim()
    if (options.type === 'face') facePromptText.value = text
    if (options.type === 'illustration' && options.task === 'generate') illustrationSceneText.value = text
    if (options.type === 'illustration' && options.task === 'prompt') illustrationDetailText.value = text
    return text
  }

  // 自定义 prompt 生成图片
  async function generate() {
    if (!prompt.value?.trim()) {
      useStateStore().toast.add({
        title: '提示词不能为空',
        description: '请输入图片描述',
        color: 'warning',
        icon: 'i-lucide-alert-triangle',
      })
      return
    }
    const text = prompt.value.trim()
    phase.value = 'image'
    activeTask.value = 'generate'
    try {
      const result = await imageApi.generate(text, {
        task: 'generate',
        model: useModelStore().activeModels.image,
      })
      if (result) {
        generateOriginalUrls.value = result.originalUrls
        generatePrompts.value = result.originalUrls.map(() => text)
      }
    } finally {
      finish()
    }
  }

  // 基于当前已有内容生成患者头像
  async function face() {
    phase.value = 'prompt'
    activeTask.value = 'face'
    facePromptText.value = ''
    try {
      const facePrompt = await streamPrompt({ type: 'face', task: 'generate' })
      if (!facePrompt) return
      phase.value = 'image'
      const result = await imageApi.generate(facePrompt, {
        task: 'face',
        model: useModelStore().activeModels.image,
      })
      if (result) {
        faceOriginalUrls.value = result.originalUrls
        facePrompts.value = result.originalUrls.map(() => facePrompt)
      }
    } finally {
      finish()
    }
  }

  // 使用已有提示词重新生成患者头像，跳过提示词生成阶段
  async function regenerateFace() {
    const existingPrompt = (facePromptText.value || facePrompts.value[0] || '').trim()
    if (!existingPrompt) {
      useStateStore().toast.add({
        title: '暂无提示词',
        description: '请先生成患者头像',
        color: 'warning',
        icon: 'i-lucide-alert-triangle',
      })
      return
    }
    facePromptText.value = existingPrompt
    phase.value = 'image'
    activeTask.value = 'face'
    try {
      const result = await imageApi.generate(existingPrompt, {
        task: 'face',
        model: useModelStore().activeModels.image,
      })
      if (result) {
        faceOriginalUrls.value = result.originalUrls
        facePrompts.value = result.originalUrls.map(() => existingPrompt)
      }
    } finally {
      finish()
    }
  }

  // 基于当前已有内容生成故事插图：头像硬前置 → 4 段关键情节描述 → 4 条详细提示词 → 4 张图
  async function illustration() {
    // 每张插图都必须以患者头像为参考图以保持人物一致；无头像时不启动任何阶段
    const faceImage = faceOriginalUrls.value[0]
    if (!faceImage) {
      useStateStore().toast.add({
        title: translateImage('image.needAvatarTitle', '请先生成患者头像'),
        description: translateImage(
          'image.needAvatarDescription',
          '插图需以患者头像为参考保持人物一致，请先在「患者头像」中生成头像后重试。',
        ),
        color: 'warning',
        icon: 'i-lucide-alert-triangle',
      })
      return
    }

    phase.value = 'scene'
    activeTask.value = 'illustration'
    illustrationSceneText.value = ''
    illustrationScenes.value = []
    illustrationDetailText.value = ''
    illustrationDetailPrompts.value = []
    illustrationOriginalUrls.value = []
    illustrationPrompts.value = []
    try {
      // 第一步：参考已有故事生成 4 段关键情节描述文字
      const sceneText = await streamPrompt({ type: 'illustration', task: 'generate' })
      const scenes = parseIllustrationScenes(sceneText)
      if (!scenes.length) return
      illustrationScenes.value = scenes

      // 第二步：逐段单独调用，每段生成一条详尽文生图提示词；为空时回退为原描述
      phase.value = 'prompt'
      const detailPrompts: string[] = []
      for (const scene of scenes) {
        illustrationDetailText.value = ''
        const detail = await streamPrompt({
          type: 'illustration',
          task: 'prompt',
          extra: [{ title: '当前关键情节描述', content: scene }],
        })
        detailPrompts.push(detail.trim() || scene)
        illustrationDetailPrompts.value = [...detailPrompts]
      }
      illustrationDetailText.value = ''

      // 第三步：逐张生图，每次都传头像作参考图；每生成一张立即写入以便渐进显示
      phase.value = 'image'
      const originalUrls: string[] = []
      const usedPrompts: string[] = []
      for (const p of detailPrompts) {
        const r = await imageApi.generate(p, {
          task: 'illustration',
          model: useModelStore().activeModels.image,
          image: faceImage,
        })
        if (r) {
          originalUrls.push(...r.originalUrls)
          usedPrompts.push(...r.originalUrls.map(() => p))
          illustrationOriginalUrls.value = [...originalUrls]
          illustrationPrompts.value = [...usedPrompts]
        }
      }
    } finally {
      finish()
    }
  }

  return {
    version,
    prompt,
    generateOriginalUrls,
    faceOriginalUrls,
    illustrationOriginalUrls,
    generatePrompts,
    facePrompts,
    illustrationPrompts,
    facePromptText,
    illustrationSceneText,
    illustrationScenes,
    illustrationDetailText,
    illustrationDetailPrompts,
    // 兼容原有引用：插图原始提示词文本即第一步的关键情节描述原文
    illustrationPromptText: illustrationSceneText,
    generateImages,
    faceImages,
    illustrationImages,
    error,
    status,
    isGenerating,
    currentPhase,
    currentTask,
    reset,
    generate,
    face,
    regenerateFace,
    illustration,
  }
})

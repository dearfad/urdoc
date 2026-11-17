import { DefaultChatTransport, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { useI18n } from 'vue-i18n'

const VERSION = '2026-11-02'

// 解析插图提示词：从模型返回的 ['提示词1','提示词2',...] 格式中提取各段提示词
function parseIllustrationPrompts(text: string): string[] {
  const matches = text.match(/['"][^'"]*['"]/g)
  if (!matches) return []
  return matches.map((m) => m.slice(1, -1).trim()).filter((p) => p.length > 0)
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
type Phase = 'idle' | 'prompt' | 'image'

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

  // 大模型流式输出的提示词原文，流结束后即为最终提示词
  const facePromptText = ref('')
  const illustrationPromptText = ref('')

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

  // 流式接收模型输出，实时更新提示词区，结束后保留最终提示词
  watch(
    () => [...(chat.lastMessage?.parts ?? [])],
    (parts) => {
      if (chat.lastMessage?.role !== 'assistant') return
      const text = parts
        .filter(isTextUIPart)
        .map((part) => part.text)
        .join('')
      if (activeTask.value === 'face') facePromptText.value = text
      if (activeTask.value === 'illustration') illustrationPromptText.value = text
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
    illustrationPromptText.value = ''
    finish()
  }

  // 流式生成图像提示词：内容框可实时看到模型输出，请求结束后返回完整文本
  async function streamPrompt(task: 'face' | 'illustration'): Promise<string> {
    const context = await buildGenerationContext({
      type: task,
      task: 'generate',
      target: 'image',
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
          type: task,
          task: 'generate',
          model,
          instructions: task === 'face' ? buildFaceInstructions(context.instructions) : context.instructions,
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
    if (task === 'face') facePromptText.value = text
    else illustrationPromptText.value = text
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
      const facePrompt = await streamPrompt('face')
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

  // 基于当前已有内容生成故事插图
  async function illustration() {
    phase.value = 'prompt'
    activeTask.value = 'illustration'
    illustrationPromptText.value = ''
    try {
      const refinedPrompt = await streamPrompt('illustration')
      // 以已生成的患者头像作为参考图，保持插图中人物与头像一致；未生成头像时省略参考图
      const faceImage = faceOriginalUrls.value[0] || undefined
      // 将故事拆分为 4 段提示词，逐段分别生成插图（每张生成后即时写入，便于前端渐进显示）
      const scenePrompts = parseIllustrationPrompts(refinedPrompt)
      if (!scenePrompts.length) return
      phase.value = 'image'

      const originalUrls: string[] = []
      const usedPrompts: string[] = []
      // 重新生成时先清空旧结果，避免新旧插图与提示词交错
      illustrationOriginalUrls.value = []
      illustrationPrompts.value = []
      for (const p of scenePrompts) {
        const r = await imageApi.generate(p, {
          task: 'illustration',
          model: useModelStore().activeModels.image,
          image: faceImage,
        })
        if (r) {
          originalUrls.push(...r.originalUrls)
          usedPrompts.push(...r.originalUrls.map(() => p))
          // 每生成一张立即更新，前端即可即时显示该图及其对应的场景提示词
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
    illustrationPromptText,
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

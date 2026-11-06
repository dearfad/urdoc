import { DefaultChatTransport, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'

const VERSION = '2026-11-02'

// 解析插图提示词：从模型返回的 ['提示词1','提示词2',...] 格式中提取各段提示词
function parseIllustrationPrompts(text: string): string[] {
  const matches = text.match(/['"][^'"]*['"]/g)
  if (!matches) return []
  return matches.map((m) => m.slice(1, -1).trim()).filter((p) => p.length > 0)
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
          instructions: context.instructions,
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
    illustration,
  }
})

import { DefaultChatTransport } from 'ai'
import { Chat } from '@ai-sdk/vue'

const VERSION = '2026-11-02'

// 解析插图提示词：从模型返回的 ['提示词1','提示词2',...] 格式中提取各段提示词
function parseIllustrationPrompts(text: string): string[] {
  const matches = text.match(/['"][^'"]*['"]/g)
  if (!matches) return []
  return matches
    .map((m) => m.slice(1, -1).trim())
    .filter((p) => p.length > 0)
}

export const useImageStore = defineStore('image', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:image')

  const prompt = ref('')

  // 按任务类型分别保存 originalUrls（远程 URL，体积小），避免头像与插图相互覆盖。
  // images 由 originalUrls 派生为 { url }，不持久化 base64 data URL，
  // 否则多张 base64 极易超出 localStorage 配额，导致刷新后数据丢失。
  const generateOriginalUrls = ref<string[]>([])
  const faceOriginalUrls = ref<string[]>([])
  const illustrationOriginalUrls = ref<string[]>([])

  const generateImages = computed(() => generateOriginalUrls.value.map((u) => ({ url: u })))
  const faceImages = computed(() => faceOriginalUrls.value.map((u) => ({ url: u })))
  const illustrationImages = computed(() => illustrationOriginalUrls.value.map((u) => ({ url: u })))

  const imageApi = useImageApi()

  const error = computed(() => imageApi.error.value)
  const imageApiStatus = computed(() => imageApi.status.value)

  const chat = new Chat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onError: (error) => {
      useStateStore().toast.add({
        title: '生成失败',
        description: error.message,
        color: 'error',
        icon: 'i-lucide-alert-circle',
      })
    },
  })

  const status = computed(() => {
    if (imageApiStatus.value === 'streaming') return 'streaming'
    if (chat.status !== 'idle') return chat.status === 'idle' ? 'ready' : chat.status
    return 'ready'
  })

  function reset() {
    imageApi.reset()
    prompt.value = ''
    generateOriginalUrls.value = []
    faceOriginalUrls.value = []
    illustrationOriginalUrls.value = []
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
    const result = await imageApi.generate(prompt.value, {
      task: 'generate',
      model: useModelStore().activeModels.image,
    })
    if (result) {
      generateOriginalUrls.value = result.originalUrls
    }
  }

  // 基于当前病例生成患者头像
  async function face() {
    const caseContent = useCaseStore().case.content
    if (!caseContent) {
      useStateStore().toast.add({
        title: '缺少病例数据',
        description: '请先在「生成病例」中创建病例',
        color: 'warning',
        icon: 'i-lucide-alert-triangle',
      })
      return
    }

    const instructions = await usePromptStore().getEffectivePrompt('face', 'generate')
    const { result: refinedPrompt } = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: JSON.stringify(caseContent, null, 2) }],
        instructions,
        model: useModelStore().activeModels.chat,
        stream: false,
      },
    })

    const result = await imageApi.generate(refinedPrompt, {
      task: 'face',
      model: useModelStore().activeModels.image,
    })
    if (result) {
      faceOriginalUrls.value = result.originalUrls
    }
  }

  // 基于当前故事生成故事插图
  async function illustration() {
    const storyContent = useStoryStore().story.content
    if (!storyContent) {
      useStateStore().toast.add({
        title: '缺少故事数据',
        description: '请先在「编写故事」中生成故事',
        color: 'warning',
        icon: 'i-lucide-alert-triangle',
      })
      return
    }

    const instructions = await usePromptStore().getEffectivePrompt('illustration', 'generate')
    const { result: refinedPrompt } = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: storyContent }],
        instructions,
        model: useModelStore().activeModels.chat,
        stream: false,
      },
    })

    // 以已生成的患者头像作为参考图，保持插图中人物与头像一致
    const faceImage = faceOriginalUrls.value[0]

    // 将故事拆分为 4 段提示词，逐段分别生成插图（每张生成后即时写入，便于前端渐进显示）
    const scenePrompts = parseIllustrationPrompts(refinedPrompt)
    if (!scenePrompts.length) return

    const originalUrls: string[] = []
    for (const p of scenePrompts) {
      const r = await imageApi.generate(p, {
        task: 'illustration',
        model: useModelStore().activeModels.image,
        image: faceImage,
      })
      if (r) {
        originalUrls.push(...r.originalUrls)
        // 每生成一张立即更新，前端即可即时显示该图
        illustrationOriginalUrls.value = [...originalUrls]
      }
    }
  }

  return {
    version,
    prompt,
    generateOriginalUrls,
    faceOriginalUrls,
    illustrationOriginalUrls,
    generateImages,
    faceImages,
    illustrationImages,
    error,
    reset,
    generate,
    face,
    illustration,
    status,
  }
})

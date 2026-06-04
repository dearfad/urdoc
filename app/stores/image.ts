import { DefaultChatTransport } from 'ai'
import { getPrompt } from '~/utils/prompts'
import { Chat } from '@ai-sdk/vue'

const VERSION = '2026-06-03'

export const useImageStore = defineStore('image', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:image')

  const prompt = ref('')

  const imageApi = useImageApi()

  const images = computed(() => imageApi.images.value)
  const error = computed(() => imageApi.error.value)
  const imageApiStatus = computed(() => imageApi.status.value)

  const chat = new Chat({
    transport: new DefaultChatTransport({ api: '/api/aisdk/text' }),
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
  }

  // 自定义 prompt 生成图片
  function generate() {
    if (!prompt.value?.trim()) {
      useStateStore().toast.add({
        title: '提示词不能为空',
        description: '请输入图片描述',
        color: 'warning',
        icon: 'i-lucide-alert-triangle',
      })
      return
    }
    imageApi.generate(prompt.value, {
      task: 'generate',
      model: useModelStore().activeModels.image,
    })
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

    const system = await getPrompt('face', 'generate')
    const { result: refinedPrompt } = await $fetch('/api/aisdk/text', {
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: JSON.stringify(caseContent, null, 2) }],
        system,
        model: useModelStore().activeModels.chat,
        mode: 'text',
      },
    })

    imageApi.generate(refinedPrompt, {
      task: 'face',
      model: useModelStore().activeModels.image,
    })
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

    const system = await getPrompt('illustration', 'generate')
    const { result: refinedPrompt } = await $fetch('/api/aisdk/text', {
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: storyContent }],
        system,
        model: useModelStore().activeModels.chat,
        mode: 'text',
      },
    })

    imageApi.generate(refinedPrompt, {
      task: 'illustration',
      model: useModelStore().activeModels.image,
    })
  }

  return { version, prompt, images, error, reset, generate, face, illustration, status }
})

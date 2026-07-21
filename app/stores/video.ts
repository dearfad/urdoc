import { usePromptStore } from '~/stores/prompt'

const VERSION = '2026-06-05'

export type DurationOption = 81 | 121 | 161 | 241 | 441

export const DURATION_OPTIONS: { frames: DurationOption; label: string; seconds: string }[] = [
  { frames: 81, label: '3 秒', seconds: '~3.4s' },
  { frames: 121, label: '5 秒', seconds: '~5s' },
  { frames: 161, label: '7 秒', seconds: '~6.7s' },
  { frames: 241, label: '10 秒', seconds: '~10s' },
  { frames: 441, label: '18 秒', seconds: '~18.4s' },
]

export function getDurationByContent(text: string): DurationOption {
  const len = text.length
  if (len < 100) return 81
  if (len < 300) return 121
  if (len < 600) return 161
  return 241
}

export const useVideoStore = defineStore('video', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:video')

  const videoApi = useVideoApi()

  const savedVideoUrl = ref<string | null>(null)

  const selectedFrames = ref<DurationOption | 'auto'>('auto')

  const videoUrl = computed(() => videoApi.videoUrl.value || savedVideoUrl.value)
  const progress = computed(() => videoApi.progress.value)
  const error = computed(() => videoApi.error.value)
  const videoApiStatus = computed(() => videoApi.status.value)

  const activeFrames = computed(() => {
    if (selectedFrames.value !== 'auto') return selectedFrames.value
    return 121
  })

  const status = computed(() => {
    if (videoApiStatus.value === 'streaming') return 'streaming'
    return 'ready'
  })

  watch(videoApi.videoUrl, (url) => {
    if (url) {
      savedVideoUrl.value = url
    }
  })

  function reset() {
    videoApi.reset()
    savedVideoUrl.value = null
    selectedFrames.value = 'auto'
  }

  async function generate() {
    const caseStore = useCaseStore()
    const storyStore = useStoryStore()
    const imageStore = useImageStore()
    const toast = useStateStore().toast

    const caseContent = caseStore.case.content
    const storyContent = storyStore.story.content
    const faceUrl = imageStore.originalUrls?.[0]

    if (!caseContent) {
      toast.add({
        title: '缺少病例数据',
        description: '请先在「生成病例」中创建病例',
        color: 'warning',
        icon: 'i-lucide-alert-triangle',
      })
      return
    }

    if (!storyContent) {
      toast.add({
        title: '缺少故事数据',
        description: '请先在「编写故事」中生成故事',
        color: 'warning',
        icon: 'i-lucide-alert-triangle',
      })
      return
    }

    if (!faceUrl) {
      toast.add({
        title: '缺少患者头像',
        description: '请先在「图像生成」中生成患者头像',
        color: 'warning',
        icon: 'i-lucide-alert-triangle',
      })
      return
    }

    savedVideoUrl.value = null

    const instructions = await usePromptStore().getEffectivePrompt('video', 'generate')
    const { result: refinedPrompt } = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        messages: [
          {
            role: 'user',
            content: `病例：${JSON.stringify(caseContent, null, 2)}\n\n故事：${storyContent}`,
          },
        ],
        instructions,
        model: useModelStore().activeModels.chat,
        stream: false,
      },
    })

    const num_frames = selectedFrames.value === 'auto'
      ? getDurationByContent(storyContent)
      : selectedFrames.value

    videoApi.create(refinedPrompt, {
      model: useModelStore().activeModels.video,
      image: faceUrl,
      num_frames,
      frame_rate: 24,
      width: 1152,
      height: 768,
    })
  }

  return { version, videoUrl, savedVideoUrl, progress, error, reset, generate, status, selectedFrames, activeFrames }
})

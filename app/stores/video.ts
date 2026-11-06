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
    const storyStore = useStoryStore()
    const imageStore = useImageStore()
    const faceUrl = imageStore.faceOriginalUrls[0]

    const context = await buildGenerationContext({
      type: 'video',
      task: 'generate',
      target: 'video',
    })

    savedVideoUrl.value = null

    const { result: refinedPrompt } = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: context.text }],
        instructions: context.instructions,
        model: useModelStore().activeModels.chat,
        stream: false,
        template: getChatTemplate(),
      },
    })

    // 故事缺失时按短片时长处理；头像缺失时省略参考图，不再阻断生成
    const storyText = typeof storyStore.story.content === 'string' ? storyStore.story.content : ''
    const num_frames = selectedFrames.value === 'auto'
      ? getDurationByContent(storyText)
      : selectedFrames.value

    videoApi.create(refinedPrompt, {
      model: useModelStore().activeModels.video,
      image: faceUrl || undefined,
      num_frames,
      frame_rate: 24,
      width: 1152,
      height: 768,
    })
  }

  return { version, videoUrl, savedVideoUrl, progress, error, reset, generate, status, selectedFrames, activeFrames }
})

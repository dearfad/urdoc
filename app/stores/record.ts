const VERSION = '2026-05-31'

export const useRecordStore = defineStore('record', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:record')

  const id = ref(0)

  // 核心数据源
  const caseStore = useCaseStore()
  const storyStore = useStoryStore()
  const testStore = useTestStore()
  const actStore = useActStore()
  const rateStore = useRateStore()
  const imageStore = useImageStore()
  const speechStore = useSpeechStore()
  const videoStore = useVideoStore()

  // 函数
  function reset() {
    id.value = 0
    caseStore.reset()
    storyStore.reset()
    testStore.reset()
    actStore.reset()
    rateStore.reset()
    imageStore.reset()
    speechStore.reset()
    videoStore.reset()
  }

  return {
    version,
    id,
    reset,
  }
})

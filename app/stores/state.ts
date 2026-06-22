const VERSION = '2026-06-22'
export const useStateStore = defineStore('state', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:state')

  const toast = useToast()

  const apiBaseUrl = ref('/api/chat')

  const case_ = ref<{
    textbook: Book | null
    custom: string[]
    reasoning: boolean
    isReasoning: boolean
  }>({
    textbook: null,
    custom: [],
    reasoning: false,
    isReasoning: false,
  })

  const story = ref({
    custom: [],
    reasoning: false,
    isReasoning: false,
  })

  const test = ref({
    custom: [],
    reasoning: false,
    isReasoning: false,
  })

  const act = ref({
    custom: [],
    reasoning: false,
    isReasoning: false,
  })

  const rate = ref({
    custom: [],
    reasoning: false,
    isReasoning: false,
  })

  const showCaseFooter = ref(true)

  const autoVerify = ref(false)
  const autoFix = ref(false)

  return {
    version,
    toast,
    apiBaseUrl,

    case: case_,
    story,
    test,
    act,
    rate,
    showCaseFooter,
    autoVerify,
    autoFix,
  }
})

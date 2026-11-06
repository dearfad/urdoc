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
    custom: [] as string[],
    reasoning: false,
    isReasoning: false,
  })

  const conversation = ref({
    custom: [],
    reasoning: false,
    isReasoning: false,
  })

  const discussion = ref({
    custom: [],
    reasoning: false,
    isReasoning: false,
  })

  const comment = ref({
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

  // 只清空用户录入的内容设定，保留模型、提示词、校验开关等偏好
  function resetInputs() {
    case_.value.custom = []
    // 保留 textbook 对象本身，设定面板的 v-model setter 直接读写该对象，置空会报错
    if (case_.value.textbook) {
      case_.value.textbook.content = {}
      case_.value.textbook.meta = { bookName: '', publishDate: '', edition: 0, isbn: '' }
    }
    story.value.custom = []
    conversation.value.custom = []
    discussion.value.custom = []
    comment.value.custom = []
    test.value.custom = []
    act.value.custom = []
    rate.value.custom = []
  }

  return {
    version,
    toast,
    apiBaseUrl,
    resetInputs,

    case: case_,
    story,
    conversation,
    discussion,
    comment,
    test,
    act,
    rate,
    showCaseFooter,
    autoVerify,
    autoFix,
  }
})

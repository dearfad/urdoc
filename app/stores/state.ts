const VERSION = '2026-03-24'
export const useStateStore = defineStore('state', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:state')
  // //
  // // API 地址设定
  // //
  // const apiBaseUrl = ref('/function')

  // const isModelResponseShow = ref({
  //   case: false,
  //   story: false,
  //   conversation: false,
  //   discussion: false,
  //   comment: false,
  //   test: false,
  //   act: false,
  //   rate: false,
  // })

  // // 是否编辑病例
  // const recordShowContent = ref('markdown')
  // const listRecords = ref()
  // const listSelectedRecordId = ref()

  // // AppInfo
  // // 全局信息显示
  // const appInfo = ref('')
  // const appInfos = ref([])

  // // 是否语音
  // const isVoice = ref(false)
  // const voiceId = ref(1)
  // const responseText = ref('')

  // // 当前模型生成字段
  // const modelResponseField = ref('')

  // // 思考模型是否思考
  // const isModelThinking = ref(true)

  // 当前章节选择
  const scope = ref<Scope>({
    book: '',
    part: '',
    chapter: '',
    section: '',
    subsection: '',
    topic: '',
  })

  // // Tag
  // const tag = ref<Tag>({
  //   case: [],
  //   story: ['真实'],
  //   test: ['执业医师考试'],
  //   act: [],
  //   rate: [],
  // })

  // // 聊天模式
  // const isActing = ref(false)
  // const isRating = ref(false)
  // const userPrompt = ref('')

  // // 输入框焦点状态
  // const isInputFocused = ref(false)

  // // PoseId
  // const poseId = ref('')

  return {
    version,
    // apiBaseUrl,

    // isModelResponseShow,

    // modelResponseField,
    // isModelThinking,

    // recordShowContent,
    // listRecords,
    // listSelectedRecordId,

    // appInfo,
    // appInfos,

    // isVoice,
    // voiceId,
    // responseText,

    scope,
    // tag,

    // isActing,
    // isRating,
    // userPrompt,

    // isInputFocused,

    // poseId,
  }
})

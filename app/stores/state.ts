export const useStateStore = defineStore(
  'state',
  () => {
    //
    // API 地址设定
    //
    const apiBaseUrl = ref('/function')

    // AppBar
    // 侧边栏显示切换
    const isNavDrawerShow = ref(true)
    // 底部导航栏显示切换
    const isBottomNavigationShow = ref(false)
    const isAppFooterShow = ref(false)

    // AppDebug
    // 是否开启调试模式以显示原始数据
    const isDebug = ref(false)
    // 模型返回数据流
    const modelResponseStream = ref('')
    // 模型返回数据内容
    const modelResponseString = ref('')
    const isModelResponseStringShow = ref(false)
    const isCaseModelResponseStringShow = ref(false)
    const isStoryModelResponseStringShow = ref(false)

    // 是否编辑病例
    const recordShowContent = ref('markdown')
    const listRecords = ref()
    const listSelectedRecordId = ref()

    // AppInfo
    // 全局信息显示
    const appInfo = ref('')
    const appInfos = ref([])

    // 是否语音
    const isVoice = ref(false)
    const voiceId = ref(1)
    const responseText = ref('')

    // 当前模型生成字段
    const modelResponseField = ref('')

    // 当前章节选择
    const scope = ref<Scope>({
      book: '',
      part: '',
      chapter: '',
      section: '',
      subsection: '',
      topic: '',
    })

    // Tag
    const tag = ref<Tag>({
      case: [],
      story: ['真实'],
      test: ['执业医师考试'],
      act: [],
      rate: [],
    })

    // 聊天模式
    const isActing = ref(false)
    const isRating = ref(false)
    const userPrompt = ref('')

    // 输入框焦点状态
    const isInputFocused = ref(false)

    // PoseId
    const poseId = ref('')

    return {
      apiBaseUrl,

      isNavDrawerShow,

      isBottomNavigationShow,
      isAppFooterShow,

      isModelResponseStringShow,
      isCaseModelResponseStringShow,
      isStoryModelResponseStringShow,

      isDebug,
      modelResponseStream,
      modelResponseString,
      modelResponseField,

      recordShowContent,
      listRecords,
      listSelectedRecordId,

      appInfo,
      appInfos,

      isVoice,
      voiceId,
      responseText,

      scope,
      tag,

      isActing,
      isRating,
      userPrompt,

      isInputFocused,

      poseId,
    }
  },
  {
    persist: true,
  }
)

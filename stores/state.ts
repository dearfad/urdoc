export const useStateStore = defineStore(
  'state',
  () => {
    //
    // API 地址设定
    //
    const apiBaseUrl = ref('https://urdoc.netlify.app/api')

    // AppBar
    // 左右侧边栏显示切换
    const isNavDrawerLeftShow = ref(false)
    const isNavDrawerRightShow = ref(false)
    // 底部导航栏显示切换
    const isBottomNavigationShow = ref(true)
    const isAppFooterShow = ref(true)

    // AppDebug
    // 是否开启调试模式以显示原始数据
    const isDebug = ref(false)
    // 模型返回数据流
    const modelResponseStream = ref('')
    // 模型返回数据内容
    const modelResponseString = ref('')
    const isModelResponseStringShow = ref(false)

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
    // 默认平台和模型
    const models = ref({
      chat: {
        case: {
          gateway: '直连',
          provider: '智谱',
          name: '智谱 GLM-4-Flash',
          id: 'glm-4-flash',
          url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
          key: { gateway: '', provider: 'ZHIPU_API_KEY' },
        },
        story: {
          gateway: '直连',
          provider: '智谱',
          name: '智谱 GLM-4-Flash',
          id: 'glm-4-flash',
          url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
          key: { gateway: '', provider: 'ZHIPU_API_KEY' },
        },
        test: {
          gateway: '直连',
          provider: '智谱',
          name: '智谱 GLM-4-Flash',
          id: 'glm-4-flash',
          url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
          key: { gateway: '', provider: 'ZHIPU_API_KEY' },
        },
        act: {
          gateway: '直连',
          provider: '智谱',
          name: '智谱 GLM-4-Flash',
          id: 'glm-4-flash',
          url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
          key: { gateway: '', provider: 'ZHIPU_API_KEY' },
        },
        rate: {
          gateway: '直连',
          provider: '智谱',
          name: '智谱 GLM-4-Flash',
          id: 'glm-4-flash',
          url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
          key: { gateway: '', provider: 'ZHIPU_API_KEY' },
        },
        face: {
          gateway: '直连',
          provider: '智谱',
          name: '智谱 GLM-4-Flash',
          id: 'glm-4-flash',
          url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
          key: { gateway: '', provider: 'ZHIPU_API_KEY' },
        },
        pose: {
          gateway: '直连',
          provider: '智谱',
          name: '智谱 GLM-4-Flash',
          id: 'glm-4-flash',
          url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
          key: { gateway: '', provider: 'ZHIPU_API_KEY' },
        },
      },
      image: {
        face: {
          gateway: '直连',
          provider: '智谱',
          name: 'CogView-3-Flash',
          id: 'cogview-3-flash',
          url: 'https://open.bigmodel.cn/api/paas/v4/images/generations',
          key: { gateway: '', provider: 'ZHIPU_API_KEY' },
        },
      },
      video: {
        pose: {
          gateway: '直连',
          provider: '智谱',
          name: 'CogVideoX-Flash',
          id: 'cogvideox-flash',
          url: 'https://open.bigmodel.cn/api/paas/v4/videos/generations',
          key: { gateway: '', provider: 'ZHIPU_API_KEY' },
        },
      },
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

      isNavDrawerLeftShow,
      isNavDrawerRightShow,

      isBottomNavigationShow,
      isAppFooterShow,

      isModelResponseStringShow,

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

      models,

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

export const useStateStore = defineStore(
  'state',
  () => {
    //
    // API 地址设定
    //
    const apiBaseUrl = ref('https://urdoc.pages.dev/api')

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

    // AppInfo
    // 全局信息显示
    const appInfo = ref('')

    // 当前模型生成字段
    const modelResponseField = ref('')

    // 当前章节选择
    const bookScope = ref({
      book: '外科学',
      chapter: '',
      section: '',
      subsection: '',
    })

    // Tags
    const tags = ref<Tags>({
      case: '',
      story: '真实',
      test: '执业医师考试',
    })
    // 病例id判断是否在数据库内
    const id = ref(0)
    // 是否通过验证
    const validated = ref(false)
    // 默认平台和模型
    const models = reactive({
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
      },
      images: {
        face: {
          gateway: '直连',
          provider: '智谱',
          name: 'CogView-3-Flash',
          id: 'cogview-3-flash',
          url: 'https://open.bigmodel.cn/api/paas/v4/images/generations',
          key: { gateway: '', provider: 'ZHIPU_API_KEY' },
        },
      },
      videos: {
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

    // 输入框焦点状态
    const isInputFocused = ref(false)

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

      appInfo,

      bookScope,
      tags,

      id,
      validated,

      models,

      isActing,
      isRating,

      isInputFocused,
    }
  },
  {
    persist: true,
  }
)

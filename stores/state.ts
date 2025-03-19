export const useStateStore = defineStore(
  'state',
  () => {
    // AppBar
    // 左右侧边栏显示切换
    const isNavDrawerLeftShow = ref(false)
    const isNavDrawerRightShow = ref(false)
    // 底部导航栏显示切换
    const isBottomNavigationShow = ref(true)
    // AppDebug
    // 是否开启调试模式以显示原始数据
    const isDebug = ref(false)
    // 模型返回数据流
    const modelResponseStream = ref('')
    // 模型返回数据内容
    const modelResponseString = ref('')

    // AppInfo
    // 全局信息显示
    const appInfo = ref('')

    // 当前模型生成字段
    const modelResponseField = ref('')

    // 当前章节选择
    const selectedBook = ref('')
    const selectedChapter = ref('')
    const selectedSection = ref('')
    const selectedSubsection = ref('')

    // 病例id判断是否在数据库内
    const id = ref(0)
    // 是否通过验证
    const validated = ref(false)
    // 默认平台和模型
    const selectedPlatform = ref('智谱')
    const selectedModel = ref({ name: '智谱 GLM-4-Flash', id: 'glm-4-flash' })

    // 聊天模式
    const isActing = ref(false)
    const isRating = ref(false)

    // 输入框焦点状态
    const isInputFocused = ref(false)

    return {
      isNavDrawerLeftShow,
      isNavDrawerRightShow,

      isBottomNavigationShow,

      isDebug,
      modelResponseStream,
      modelResponseString,

      appInfo,

      modelResponseField,

      selectedBook,
      selectedChapter,
      selectedSection,
      selectedSubsection,

      id,
      validated,

      selectedPlatform,
      selectedModel,

      isActing,
      isRating,

      isInputFocused,
    }
  },
  {
    persist: true,
  }
)

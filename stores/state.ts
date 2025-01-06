export const useStateStore = defineStore(
    'state',
    () => {
        // AppBar
        // 左右侧边栏显示切换
        const isNavDrawerLeftShow = ref(false)
        const isNavDrawerRightShow = ref(false)

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

        //
        const modelResponseField = ref('')
        function resetModelResponse() {
            modelResponseStream.value = ''
            modelResponseString.value = ''
            modelResponseField.value = ''
        }
        function insertModelResponseStream(value: string) {
            modelResponseStream.value += value
        }
        //

        function updateModelResponseString(value: string) {
            modelResponseString.value = value
        }
        function insertModelResponseString(value: string) {
            modelResponseString.value += value
        }
        //

        function updateModelResponseField(value: string) {
            modelResponseField.value = value
        }
        //
        const currentPatientTab = ref('')
        //
        const selectedBook = ref('')
        const selectedChapter = ref('')
        const selectedSection = ref('')
        const selectedSubsection = ref('')
        const caseTag = ref('')
        const storyTag = ref('真实')
        const testTag = ref('执业医师考试')

        // 病例id判断是否在数据库内
        const id = ref(0)
        // 是否通过验证
        const validated = ref(false)
        //
        const selectedPlatform = ref('智谱')
        const selectedModel = ref({ name: '智谱 GLM-4-Flash', id: 'glm-4-flash' })

        //
        const currentContent = ref('')
        const isInputFocused = ref(false)

        const responseData = ref()

        function updateResponseData(value: string | JSON) {
            responseData.value = value
        }

        return {
            isNavDrawerLeftShow,
            isNavDrawerRightShow,
            isDebug,
            modelResponseStream,
            modelResponseString,
            appInfo,

            modelResponseField,
            resetModelResponse,

            insertModelResponseStream,

            updateModelResponseString,
            insertModelResponseString,

            updateModelResponseField,

            selectedBook,
            selectedChapter,
            selectedSection,
            selectedSubsection,
            caseTag,
            storyTag,
            testTag,

            id,
            validated,

            selectedPlatform,
            selectedModel,

            //
            currentPatientTab,

            currentContent,
            isInputFocused,
            responseData,
            updateResponseData,
        }
    },
    {
        persist: true,
    }
)

export const useStateStore = defineStore(
    'state',
    () => {
        //
        const debug = ref(false)
        function updateDebug(value: boolean) {
            debug.value = value
        }
        //
        const appInfo = ref('')
        //
        const modelResponseStream = ref('')
        const modelResponseString = ref('')
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
        //
        const id = ref(0)
        const validated = ref(false)
        //
        const selectedPlatform = ref('智谱')
        const selectedModel = ref({ name: '智谱 GLM-4-Flash', id: 'glm-4-flash' })

        const currentContent = ref('')
        const isInputFocused = ref(false)

        const responseData = ref()

        function updateResponseData(value: string | JSON) {
            responseData.value = value
        }

        return {
            debug,
            updateDebug,

            appInfo,

            modelResponseStream,
            modelResponseString,
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

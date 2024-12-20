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
        function updateAppInfo(value: string) {
            appInfo.value = value
        }
        //
        const modelResponseStream = ref('')
        function resetModelResponseStream() {
            modelResponseStream.value = ''
        }
        function insertModelResponseStream(value: string) {
            modelResponseStream.value += value
        }
        //
        const modelResponseString = ref('')
        function resetModelResponseString() {
            modelResponseString.value = ''
        }
        function updateModelResponseString(value: string) {
            modelResponseString.value = value
        }
        function insertModelResponseString(value: string) {
            modelResponseString.value += value
        }
        //
        const modelResponseField = ref('')
        function resetModelResponseField() {
            modelResponseField.value = ''
        }
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
            updateAppInfo,

            modelResponseStream,
            resetModelResponseStream,
            insertModelResponseStream,

            modelResponseString,
            resetModelResponseString,
            updateModelResponseString,
            insertModelResponseString,

            modelResponseField,
            resetModelResponseField,
            updateModelResponseField,

            selectedBook,
            selectedChapter,
            selectedSection,
            selectedSubsection,
            caseTag,
            storyTag,
            testTag,

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

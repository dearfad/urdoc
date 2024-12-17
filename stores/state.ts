export const useStateStore = defineStore('state', () => {
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
    const currentContent = ref('')
    const isInputFocused = ref(false)

    const responseData = ref()

    const selectedBook = ref('任意')
    const selectedChapter = ref('任意')
    const selectedSection = ref('任意')
    const selectedSubsection = ref('任意')
    const genCaseKeyPoint = ref('')
    const genStoryKeyPoint = ref('真实')
    const genTestKeyPoint = ref('执业医师考试')

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

        currentPatientTab,

        currentContent,
        isInputFocused,
        responseData,
        updateResponseData,
        selectedBook,
        selectedChapter,
        selectedSection,
        selectedSubsection,
        genCaseKeyPoint,
        genStoryKeyPoint,
        genTestKeyPoint,
    }
})

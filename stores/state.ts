export const useStateStore = defineStore('state', () => {
    const appInfo = ref('')

    const currentContent = ref('')
    const isInputFocused = ref(false)

    const responseData = ref()
    const responseDataStream = ref('')
    const responseDataField = ref('')

    const selectedBook = ref('任意')
    const selectedChapter = ref('任意')
    const selectedSection = ref('任意')
    const selectedSubsection = ref('任意')
    const genCaseKeyPoint = ref('')
    const genStoryKeyPoint = ref('真实')
    const genTestKeyPoint = ref('执业医师考试')

    function updateAppInfo(value: string) {
        appInfo.value = value
    }
    function updateResponseData(value: string | JSON) {
        responseData.value = value
    }

    function updateResponseDataStream(value: string) {
        responseDataStream.value = value
    }
    function insertResponseDataStream(value: string) {
        responseDataStream.value += value
    }
    function resetResponseDataStream() {
        responseDataStream.value = ''
    }
    function updateResponseDataField(value: string) {
        responseDataField.value = value
    }
    function resetResponseDataField() {
        responseDataField.value = ''
    }

    return {
        appInfo,
        updateAppInfo,
        currentContent,
        isInputFocused,
        responseDataStream,
        responseDataField,
        responseData,
        updateResponseData,
        updateResponseDataStream,
        insertResponseDataStream,
        resetResponseDataStream,
        updateResponseDataField,
        resetResponseDataField,
        selectedBook,
        selectedChapter,
        selectedSection,
        selectedSubsection,
        genCaseKeyPoint,
        genStoryKeyPoint,
        genTestKeyPoint,
    }
})

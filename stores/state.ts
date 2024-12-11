export const useStateStore = defineStore('state', () => {
    const currentContent = ref('')
    const isInputFocused = ref(false)
    const responseDataStream = ref('')
    const responseDataField = ref('')
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

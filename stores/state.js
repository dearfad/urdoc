export const useStateStore = defineStore('state', () => {
    const currentContent = ref('')
    const isInputFocused = ref(false)
    const currentGenCaseField = ref('')
    const currentGenTestField = ref('')
    const globalInfo = ref('')

    const selectedBook = ref('任意')
    const selectedChapter = ref('任意')
    const selectedSection = ref('任意')
    const selectedSubsection = ref('任意')
    const genCaseKeyPoint = ref('')
    const genStoryKeyPoint = ref('真实')
    const genTestKeyPoint = ref('执业医师考试')

    function resetCurrentGenCaseField() {
        currentGenCaseField.value = ''
    }

    function resetCurrentGenTestField() {
        currentGenTestField.value = ''
    }

    function updateState(stateName, value) {
        switch (stateName) {
            case 'currentGenCaseField':
                currentGenCaseField.value = value
                break
            default:
                break
        }
    }

    return {
        currentContent,
        isInputFocused,
        currentGenCaseField,
        currentGenTestField,
        resetCurrentGenCaseField,
        resetCurrentGenTestField,
        updateState,
        globalInfo,
        selectedBook,
        selectedChapter,
        selectedSection,
        selectedSubsection,
        genCaseKeyPoint,
        genStoryKeyPoint,
        genTestKeyPoint,
    }
})

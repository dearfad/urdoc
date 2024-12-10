export const useStateStore = defineStore('state', () => {
    const currentContent = ref('')
    const isInputFocused = ref(false)
    const currentGenField = ref('')

    const selectedBook = ref('任意')
    const selectedChapter = ref('任意')
    const selectedSection = ref('任意')
    const selectedSubsection = ref('任意')
    const genCaseKeyPoint = ref('')
    const genStoryKeyPoint = ref('真实')
    const genTestKeyPoint = ref('执业医师考试')

    function resetCurrentGenField() {
        currentGenField.value = ''
    }

    function updateCurrentGenField(value: string) {
        currentGenField.value = value
    }

    return {
        currentContent,
        isInputFocused,
        currentGenField,
        resetCurrentGenField,
        updateCurrentGenField,
        selectedBook,
        selectedChapter,
        selectedSection,
        selectedSubsection,
        genCaseKeyPoint,
        genStoryKeyPoint,
        genTestKeyPoint,
    }
})

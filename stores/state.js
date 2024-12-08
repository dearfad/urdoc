export const useStateStore = defineStore('state', () => {
    const currentContent = ref('')
    const isInputFocused = ref(false)
    const currentGenCaseField = ref('')
    const currentGenTestField = ref('')

    const selectedBook = ref('任意')
    const selectedChapter = ref('任意')
    const selectedSection = ref('任意')
    const selectedSubsection = ref('任意')
    const genCaseKeyPoint = ref('')
    const genStoryKeyPoint = ref('真实')
    const genTestKeyPoint = ref('执业医师考试')

    return {
        currentContent,
        isInputFocused,
        currentGenCaseField,
        currentGenTestField,
        selectedBook,
        selectedChapter,
        selectedSection,
        selectedSubsection,
        genCaseKeyPoint,
        genStoryKeyPoint,
        genTestKeyPoint,
    }
})

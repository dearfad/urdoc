export const useStateStore = defineStore('state', () => {
    const currentContent = ref('')
    const isInputFocused = ref(false)
    const currentGenCaseField = ref('')

    const selectedBook = ref('任意')
    const selectedChapter = ref('任意')
    const selectedSection = ref('任意')
    const selectedSubsection = ref('任意')
    const genCaseKeyPoint = ref('')

    return {
        currentContent,
        isInputFocused,
        currentGenCaseField,
        selectedBook,
        selectedChapter,
        selectedSection,
        selectedSubsection,
        genCaseKeyPoint,
    }
})

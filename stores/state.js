export const useStateStore = defineStore('state', () => {
    const currentContent = ref('')
    const isInputFocused = ref(false)
    const currentGenCaseField = ref('')
    return { currentContent, isInputFocused, currentGenCaseField }
})

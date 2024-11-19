export const useStateStore = defineStore('state', () => {
    const currentContent = ref('')
    const isInputFocused = ref(false)
    return { currentContent, isInputFocused }
})

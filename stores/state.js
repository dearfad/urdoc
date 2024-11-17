export const useStateStore = defineStore('state', () => {
    const currentContent = ref('')
    return { currentContent }
})

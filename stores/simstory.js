export const useSimStoryStore = defineStore('simstory', () => {
    const simStory = ref('')
    const simStoryFields = ref([])

    function updateSimStory(value) {
        simStory.value = value
    }

    function deleteSimStory() {
        simStory.value = ''
    }

    return { simStory, simStoryFields, updateSimStory, deleteSimStory }
})

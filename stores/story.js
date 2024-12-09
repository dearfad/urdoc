export const useStoryStore = defineStore('story', () => {
    const story = ref('')
    function clearStory() {
        story.value = ''
    }
    function updateStory(newCase) {
        story.value = newCase
    }
    return { story, clearStory, updateStory }
})

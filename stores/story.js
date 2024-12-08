export const useStoryStore = defineStore('story', () => {
    const story = ref('')
    function clearStory() {
        story.value = ''
    }
    return { story, clearStory }
})

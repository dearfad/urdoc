export default function () {
    const caseStore = useCaseStore()
    const storyStore = useStoryStore()
    const testStore = useTestStore()
    function clearAll() {
        caseStore.clearSimCase()
        storyStore.clearStory()
        testStore.clearTest()
    }
    return {
        clearAll,
    }
}

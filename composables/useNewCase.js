export default function () {
    const caseStore = useCaseStore()
    const { clearSimCaseJson } = caseStore
    const storyStore = useStoryStore()
    const { clearStory } = storyStore
    const testStore = useTestStore()
    const { clearTest } = testStore
    function clearAll() {
        clearSimCaseJson()
        clearStory()
        clearTest()
    }
    return {
        clearSimCaseJson,
        clearStory,
        clearTest,
        clearAll,
    }
}

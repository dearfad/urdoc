export default function () {
    const simCaseStore = useSimCaseStore()
    const simStoryStore = useSimStoryStore()
    const simTestStore = useSimTestStore()
    function clearAll() {
        simCaseStore.deleteSimCase()
        simStoryStore.deleteSimStory()
        simTestStore.deleteSimTest()
    }
    return {
        clearAll,
    }
}

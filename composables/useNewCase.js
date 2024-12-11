export default function () {
    const simCaseStore = useSimCaseStore()
    const simStoryStore = useSimStoryStore()
    const simTestStore = useSimTestStore()
    function deleteAll() {
        simCaseStore.deleteSimCase()
        simStoryStore.deleteSimStory()
        simTestStore.deleteSimTest()
    }
    return {
        deleteAll,
    }
}

export default function () {
    const simCaseStore = useSimCaseStore()
    const simStoryStore = useSimStoryStore()
    const simTestStore = useSimTestStore()
    const stateStore = useStateStore()
    function deleteAll() {
        simCaseStore.deleteSimCase()
        simStoryStore.deleteSimStory()
        simTestStore.deleteSimTest()
        stateStore.id = null
        stateStore.validated = null
    }
    return {
        deleteAll,
    }
}

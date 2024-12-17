export default function () {
    const modelStore = useModelStore()

    function getPlatform() {
        switch (modelStore.platform) {
            case 'bigModel':
                return useBigModel()
            default:
                return useBigModel()
        }
    }

    function getCase(messages: MessagesArray) {
        const platform = getPlatform()
        return platform.getCase(messages)
    }

    function getStory(messages: MessagesArray) {
        const platform = getPlatform()
        return platform.getStory(messages)
    }

    function getTest(messages: MessagesArray) {
        const platform = getPlatform()
        return platform.getTest(messages)
    }

    return { getCase, getStory, getTest }
}

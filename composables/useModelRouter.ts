export default function () {
    const stateStore = useStateStore()

    function getPlatform() {
        switch (stateStore.selectedPlatform) {
            case 'bigModel':
                // BigModel 智谱AI大模型开放平台 https://bigmodel.cn
                return useBigModel()
            case 'xfyun':
                // 讯飞开放平台 星火大模型 https://www.xfyun.cn/
                return useXunFeiYun()
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

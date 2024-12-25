export default function () {
    const stateStore = useStateStore()
    const model = useUrdocModel()

    function getModelParams(
        messages: MessagesArray,
        watchFields: string[],
        responseFormat: ResponseFormatType = { type: 'json_object' }
    ) {
        const modelParams: ModelParamsType = {
            apiKey: '',
            model: stateStore.selectedModel,
            url: '',
            messages: messages,
            watchFields: watchFields,
            responseFormat: responseFormat,
        }

        switch (stateStore.selectedPlatform) {
            // nuxt.config.ts 处理CORS跨域请求
            // routeRules: {
            //     '/api/xfyun/**': {
            //         proxy: 'https://spark-api-open.xf-yun.com/**',
            //     },
            //     '/api/doubao/**': {
            //         proxy: 'https://ark.cn-beijing.volces.com/**',
            //     },
            // },
            case 'bigmodel':
                // BigModel 智谱AI大模型开放平台 https://bigmodel.cn
                modelParams.apiKey = import.meta.env.VITE_BIGMODEL_API_KEY
                modelParams.url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
                break
            case 'xfyun':
                // 讯飞开放平台 星火大模型 https://www.xfyun.cn/
                modelParams.apiKey = import.meta.env.VITE_XFYUN_API_KEY
                modelParams.url = '/api/xfyun/v1/chat/completions'
                break
            case 'doubao':
                // 火山引擎豆包大模型 lite 4k https://www.volcengine.com/
                modelParams.apiKey = import.meta.env.VITE_DOUBAO_API_KEY
                modelParams.url = '/api/doubao/api/v3/chat/completions'
                break
            case 'aliyun':
                // 火山引擎豆包大模型 lite 4k https://www.volcengine.com/
                modelParams.apiKey = import.meta.env.VITE_ALIYUN_API_KEY
                modelParams.url =
                    'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
                break
            default:
                stateStore.appInfo = '未知平台！'
                break
        }
        return modelParams
    }

    async function getCase(messages: MessagesArray) {
        const simCaseStore = useSimCaseStore()
        const params = getModelParams(messages, simCaseStore.simCaseFields)
        return await model.getResponse(params)
    }

    async function getStory(messages: MessagesArray) {
        const simStoryStore = useSimStoryStore()
        const params = getModelParams(messages, simStoryStore.simStoryFields, { type: 'text' })
        return await model.getResponse(params)
    }

    async function getTest(messages: MessagesArray) {
        const simTestStore = useSimTestStore()
        const params = getModelParams(messages, simTestStore.simTestFields)
        return await model.getResponse(params)
    }

    return { getCase, getStory, getTest }
}

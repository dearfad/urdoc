export default function () {
    const stateStore = useStateStore()
    const modelResponse = useModelResponse()
    const caseStore = useCaseStore()

    function getModelParams(
        messages: MessagesArray,
        watchFields: string[],
        responseFormat: ResponseFormatType = { type: 'json_object' }
    ) {
        const modelParams: ModelParamsType = {
            apiKey: '',
            model: stateStore.selectedModel.id,
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
            case '智谱':
                modelParams.apiKey = import.meta.env.VITE_BIGMODEL_API_KEY
                modelParams.url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
                break
            case '讯飞':
                modelParams.apiKey = import.meta.env.VITE_XFYUN_API_KEY
                modelParams.url = '/api/xfyun/v1/chat/completions'
                break
            case '火山方舟':
                modelParams.apiKey = import.meta.env.VITE_DOUBAO_API_KEY
                modelParams.url = '/api/doubao/api/v3/chat/completions'
                break
            case '阿里云百炼':
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
        const params = getModelParams(messages, caseStore.caseContentFields)
        return await modelResponse.getResponse(params)
    }

    async function getStory(messages: MessagesArray) {
        const params = getModelParams(messages, caseStore.caseStoryFields, { type: 'text' })
        return await modelResponse.getResponse(params)
    }

    async function getTest(messages: MessagesArray) {
        const params = getModelParams(messages, caseStore.caseTestFields)
        return await modelResponse.getResponse(params)
    }

    return { getCase, getStory, getTest }
}

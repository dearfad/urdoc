import { jsonrepair } from 'jsonrepair'
export default function () {
    const apiKey = import.meta.env.VITE_BIGMODEL_API_KEY
    const modelStore = useModelStore()
    const stateStore = useStateStore()
    //
    async function getCase(messages: MessagesArray) {
        const simCaseStore = useSimCaseStore()
        return await getResponse(messages, simCaseStore.simCaseFields)
    }

    async function getStory(messages: MessagesArray) {
        const simStoryStore = useSimStoryStore()
        return await getResponse(messages, simStoryStore.simStoryFields, { type: 'text' })
    }

    async function getTest(messages: MessagesArray) {
        const simTestStore = useSimTestStore()
        return await getResponse(messages, simTestStore.simTestFields)
    }
    //
    async function getResponse(
        messages: MessagesArray,
        watchFields: string[],
        responseFormat: ResponseFormatType = { type: 'json_object' }
    ) {
        //
        let dataFieldPointer = 0
        stateStore.resetModelResponseStream()
        stateStore.resetModelResponseString()
        stateStore.resetModelResponseField()
        //
        const response = await $fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + apiKey,
            },
            body: {
                model: modelStore.model,
                messages: messages,
                stream: true,
                temperature: 0.95,
                top_p: 0.7,
                max_tokens: 1024,
                response_format: responseFormat,
            },
            responseType: 'stream',
        })
        if (!response) {
            return stateStore.updateAppInfo('获取模型响应数据为空！')
        }

        const reader = (response as ReadableStream).pipeThrough(new TextDecoderStream()).getReader()
        while (true) {
            const { value, done } = await reader.read()
            if (done) break
            stateStore.insertModelResponseStream(value)

            // 解析模型响应数据流
            const lines = value.split('\n\n')
            lines.forEach((line: string) => {
                if (line != '' && line != 'data: [DONE]') {
                    const jsonDataStr = line.split('data: ')[1].trim()
                    try {
                        const jsonData = JSON.parse(jsonDataStr)
                        stateStore.insertModelResponseString(jsonData.choices[0].delta.content)
                        // 更新当前生成字段
                        if (watchFields.length > 0) {
                            if (
                                stateStore.modelResponseString.includes(
                                    watchFields[dataFieldPointer]
                                )
                            ) {
                                stateStore.updateModelResponseField(watchFields[dataFieldPointer])
                                dataFieldPointer++
                            }
                        }
                    } catch (error) {
                        return stateStore.updateAppInfo(`解析模型相应数据失败：${error}`)
                    }
                }
            })
        }

        // 解析modelResponseString的json问题
        if (responseFormat == ({ type: 'json_object' } as ResponseFormatType)) {
            try {
                let dataString = stateStore.modelResponseString
                dataString = dataString.includes('```json') ? dataString.slice(7, -3) : dataString
                dataString = jsonrepair(dataString)
                stateStore.updateModelResponseString(dataString)
            } catch (error) {
                stateStore.updateAppInfo(`Failed to parse message: ${error}`)
            }
        }
        // console.log(responseDataStream.value)
        return stateStore.modelResponseString
    }

    return {
        getCase,
        getStory,
        getTest,
    }
}

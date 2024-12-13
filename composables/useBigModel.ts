import { jsonrepair } from 'jsonrepair'
export default function () {
    const apiKey = import.meta.env.VITE_BIGMODEL_API_KEY
    const modelStore = useModelStore()
    const stateStore = useStateStore()
    //
    const { responseDataStream, responseData } = storeToRefs(stateStore)
    const {
        updateResponseData,
        insertResponseDataStream,
        updateResponseDataField,
        resetResponseDataStream,
        resetResponseDataField,
    } = stateStore
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

    async function getResponse(
        messages: MessagesArray,
        watchFields: string[],
        responseFormat: ResponseFormatType = { type: 'json_object' }
    ) {
        let dataFieldPointer = 0
        stateStore.resetResponseDataStream()
        //
        resetResponseDataStream()
        resetResponseDataField()
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
            return stateStore.updateAppInfo('Response body is null')
        }

        const reader = (response as ReadableStream).pipeThrough(new TextDecoderStream()).getReader()
        while (true) {
            const { value, done } = await reader.read()
            if (done) break

            stateStore.updateModelResponseStream(value)

            const lines = value.split('\n\n')
            lines.forEach((line: string) => {
                if (line != '' && line != 'data: [DONE]') {
                    const jsonDataStr = line.split('data: ')[1].trim()
                    try {
                        const jsonData = JSON.parse(jsonDataStr)
                        insertResponseDataStream(jsonData.choices[0].delta.content)
                        // 更新当前生成字段
                        if (watchFields.length > 0) {
                            if (responseDataStream.value.includes(watchFields[dataFieldPointer])) {
                                updateResponseDataField(watchFields[dataFieldPointer])
                                dataFieldPointer++
                            }
                        }
                    } catch (error) {
                        console.log('Failed to parse stream: ', error)
                    }
                }
            })
        }

        // 解析responseDataStream的json问题
        switch (responseFormat) {
            case { type: 'json_object' }:
                try {
                    let responseDataStreamString = responseDataStream.value
                    responseDataStreamString = responseDataStreamString.includes('```json')
                        ? responseDataStreamString.slice(7, -3)
                        : responseDataStreamString
                    responseDataStreamString = jsonrepair(responseDataStreamString)
                    const responseDataStreamJson = JSON.parse(responseDataStreamString)
                    updateResponseData(responseDataStreamJson)
                } catch (error) {
                    console.error('Failed to parse message:', error)
                }
                break
            case { type: 'text' }:
                updateResponseData(responseDataStream.value)
                break
            default:
                break
        }
        // console.log(responseDataStream.value)
        return responseData.value
    }

    return {
        getResponse,
        getCase,
        getStory,
        getTest,
    }
}

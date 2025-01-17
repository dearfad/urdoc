import { jsonrepair } from 'jsonrepair'
export default function () {
    async function getResponse(params: ModelParamsType) {
        const stateStore = useStateStore()
        stateStore.modelResponseStream = ''
        stateStore.modelResponseString = ''
        stateStore.modelResponseField = ''
        let dataFieldPointer = 0
        //
        const response = await $fetch(params.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + params.apiKey,
            },
            body: {
                model: params.model,
                messages: params.messages,
                stream: true,
                temperature: 0.95,
                top_p: 0.7,
                max_tokens: 1024,
                response_format: params.responseFormat,
            },
            responseType: 'stream',
        })
        if (!response) {
            return (stateStore.appInfo = '获取模型响应数据为空！')
        }

        // Consuming SSE (Server Sent Events) via POST request
        // https://nuxt.com/docs/getting-started/data-fetching
        const reader = (response as ReadableStream).pipeThrough(new TextDecoderStream()).getReader()
        while (true) {
            const { value, done } = await reader.read()
            if (done) break
            stateStore.modelResponseStream += value

            // 解析模型响应数据流
            const lines = value.split('\n\n')
            lines.forEach((line: string) => {
                if (line != '' && line != 'data: [DONE]') {
                    try {
                        const jsonDataStr = line.split('data: ')[1].trim()
                        const jsonData = JSON.parse(jsonDataStr)
                        stateStore.modelResponseString += jsonData.choices[0].delta.content
                        // 更新当前生成字段
                        if (params.watchFields.length > 0) {
                            if (
                                stateStore.modelResponseString.includes(
                                    params.watchFields[dataFieldPointer]
                                )
                            ) {
                                stateStore.modelResponseField = params.watchFields[dataFieldPointer]
                                dataFieldPointer++
                            }
                        }
                    } catch (error) {
                        return (stateStore.appInfo = `解析模型相应数据失败：${error}`)
                    }
                }
            })
        }

        // 解析modelResponseString的json问题
        if (params.responseFormat.type === 'json_object') {
            try {
                let dataString = stateStore.modelResponseString
                dataString = dataString.includes('```json') ? dataString.slice(7, -3) : dataString
                dataString = jsonrepair(dataString)
                stateStore.modelResponseString = dataString
            } catch (error) {
                stateStore.appInfo = `Failed to parse message: ${error}`
            }
        }
        // console.log(responseDataStream.value)
        return stateStore.modelResponseString
    }

    return {
        getResponse,
    }
}

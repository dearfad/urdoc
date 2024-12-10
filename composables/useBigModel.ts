import { jsonrepair } from 'jsonrepair'
export default function () {
    const apiKey = import.meta.env.VITE_BIGMODEL_API_KEY
    const modelStore = useModelStore()
    const stateStore = useStateStore()
    const simStoryStore = useSimStoryStore()
    const simTestStore = useSimTestStore()

    async function getCase(messages: Array<{ role: string; content: string }>) {
        const simCaseStore = useSimCaseStore()
        return await getResponse(messages, simCaseStore.simCaseFields, 'case', 'json')
    }

    async function getStory(messages: Array<{ role: string; content: string }>) {
        return await getResponse(messages, [], 'story', 'text')
    }

    async function getTest(messages: Array<{ role: string; content: string }>) {
        const simTestStore = useSimTestStore()
        return await getResponse(messages, simTestStore.simTestFields, 'test', 'json')
    }

    async function getResponse(
        messages: Array<{ role: string; content: string }>,
        watchFields: string[],
        genType = '',
        format = 'json'
    ) {
        let message = ''
        const response: Response = await $fetch(
            'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + apiKey,
                },
                body: {
                    model: modelStore.model,
                    messages: messages,
                    stream: true,
                },
                responseType: 'stream',
            }
        )

        let currentFieldPointer = 0
        if (response.body) {
            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
            // const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
            while (true) {
                const { value, done } = await reader.read()
                if (done) break
                const lines = value.split('\n\n')
                lines.forEach((line: string) => {
                    if (line != '' && line != 'data: [DONE]') {
                        const jsonDataStr = line.split('data: ')[1].trim()
                        try {
                            const jsonData = JSON.parse(jsonDataStr)
                            message += jsonData.choices[0].delta.content

                            // 即时显示内容
                            switch (genType) {
                                case 'story':
                                    simStoryStore.updateSimStory(message)
                                    break
                                case 'test':
                                    simTestStore.updateSimTest(message)
                                    break
                                default:
                                    break
                            }
                            // 更新当前生成字段
                            if (watchFields.length > 0) {
                                if (message.includes(watchFields[currentFieldPointer])) {
                                    stateStore.updateCurrentGenField(
                                        watchFields[currentFieldPointer]
                                    )
                                    currentFieldPointer++
                                }
                            }
                        } catch (error) {
                            console.log('Failed to parse stream: ', error)
                        }
                    }
                })
            }

            // 解析message的json问题
            switch (format) {
                case 'json':
                    try {
                        message = message.includes('```json') ? message.slice(7, -3) : message
                        message = jsonrepair(message)
                        message = JSON.parse(message)
                    } catch (error) {
                        console.error('Failed to parse message:', error)
                        message = ''
                    }
                    break
                default:
                    break
            }
            // console.log(message)
            return message
        } else {
            console.error('Response body is null')
        }
    }

    return {
        getResponse,
        getCase,
        getStory,
        getTest,
    }
}

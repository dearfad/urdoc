import { jsonrepair } from 'jsonrepair'
export default function () {
    const apiKey = import.meta.env.VITE_BIGMODEL_API_KEY
    const modelStore = useModelStore()
    const stateStore = useStateStore()
    const storyStore = useStoryStore()
    const testStore = useTestStore()

    async function getCase(messages) {
        const caseStore = useCaseStore()
        return await getResponse(messages, caseStore.caseFields, 'case', 'json')
    }

    async function getStory(messages) {
        return await getResponse(messages, [], 'story', '')
    }

    async function getTest(messages) {
        const testStore = useTestStore()
        return await getResponse(messages, testStore.testFields, 'test', 'json')
    }

    async function getResponse(messages, watchFields = [], genType = '', format = 'json') {
        let message = ''
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
            },
            responseType: 'stream',
        })

        let currentFieldPointer = 0
        const reader = response.pipeThrough(new TextDecoderStream()).getReader()
        while (true) {
            const { value, done } = await reader.read()
            if (done) break
            const lines = value.split('\n\n')
            lines.forEach((line) => {
                if (line != '' && line != 'data: [DONE]') {
                    const jsonDataStr = line.split('data: ')[1].trim()
                    try {
                        const jsonData = JSON.parse(jsonDataStr)
                        message += jsonData.choices[0].delta.content

                        // 即时显示内容
                        switch (genType) {
                            case 'story':
                                storyStore.updateStory(message)
                                break
                            case 'test':
                                testStore.updateTest(message)
                                break
                            default:
                                break
                        }
                        // 更新当前生成字段
                        if (watchFields.length > 0) {
                            if (message.includes(watchFields[currentFieldPointer])) {
                                switch (genType) {
                                    case 'case':
                                        stateStore.updateState(
                                            'currentGenCaseField',
                                            watchFields[currentFieldPointer]
                                        )
                                        break
                                    case 'test':
                                        stateStore.updateState(
                                            'currentGenTestField',
                                            watchFields[currentFieldPointer]
                                        )
                                        break
                                    default:
                                        break
                                }
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
        if (format == 'json') {
            try {
                message = message.includes('```json') ? message.slice(7, -3) : message
                message = jsonrepair(message)
                message = JSON.parse(message)
            } catch (error) {
                console.error('Failed to parse message:', error)
                message = ''
            }
        }
        // console.log(message)
        return message
    }

    return {
        getResponse,
        getCase,
        getStory,
        getTest,
    }
}

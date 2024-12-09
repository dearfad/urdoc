import { jsonrepair } from 'jsonrepair'
export default function () {
    const apiKey = import.meta.env.VITE_BIGMODEL_API_KEY
    const modelStore = useModelStore()
    const stateStore = useStateStore()

    async function getCase(messages) {
        const caseStore = useCaseStore()
        return await getResponse(messages, caseStore.caseFields)
    }

    async function getResponse(messages, caseFields) {
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
                        // 更新当前病例生成字段
                        if (message.includes(caseFields[currentFieldPointer])) {
                            stateStore.updateState(
                                'currentGenCaseField',
                                caseFields[currentFieldPointer]
                            )
                            currentFieldPointer++
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }
            })
        }
        try {
            message = message.includes('```json') ? message.slice(7, -3) : message
            message = jsonrepair(message)
            message = JSON.parse(message)
        } catch (error) {
            console.error('Failed to parse message:', error)
            // globalInfo.value = 'Failed to parse simCase' + error
            message = ''
        }
        // console.log(message)
        return message
    }

    const storyStore = useStoryStore()
    const { story } = storeToRefs(storyStore)

    async function getStory(messages) {
        story.value = ''

        const response = await $fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + apiKey,
            },
            body: {
                model: modelStore.model,
                messages: messages,
                // 流式输出
                stream: true,
            },
            responseType: 'stream',
        })

        // // Create a new ReadableStream from the response with TextDecoderStream to get the data as text
        const reader = response.pipeThrough(new TextDecoderStream()).getReader()

        // // Read the chunk of data as we get it
        while (true) {
            const { value, done } = await reader.read()
            if (done) break
            const lines = value.split('\n\n')
            lines.forEach((line) => {
                // console.log(line)
                if (line != '' && line != 'data: [DONE]') {
                    const jsonDataStr = line.split('data: ')[1].trim()
                    try {
                        const jsonData = JSON.parse(jsonDataStr)
                        const content = jsonData.choices[0].delta.content
                        story.value = story.value + content
                    } catch (err) {
                        console.log(err)
                    }
                    // console.log(content)
                }
            })
        }
        // console.log(message.value)
        //
        // message.value = response.choices[0].message.content
    }

    const testStore = useTestStore()
    const { test } = storeToRefs(testStore)

    async function getTest(messages) {
        test.value = ''

        const response = await $fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + apiKey,
            },
            body: {
                model: modelStore.model,
                messages: messages,
                // 流式输出
                stream: true,
            },
            responseType: 'stream',
        })

        let n = 0
        stateStore.resetCurrentGenTestField()

        // // Create a new ReadableStream from the response with TextDecoderStream to get the data as text
        const reader = response.pipeThrough(new TextDecoderStream()).getReader()

        // // Read the chunk of data as we get it
        while (true) {
            const { value, done } = await reader.read()
            if (done) break
            const lines = value.split('\n\n')
            lines.forEach((line) => {
                // console.log(line)
                if (line != '' && line != 'data: [DONE]') {
                    const jsonDataStr = line.split('data: ')[1].trim()
                    try {
                        const jsonData = JSON.parse(jsonDataStr)
                        const content = jsonData.choices[0].delta.content
                        test.value = test.value + content

                        const genTestField = ['题目1', '题目2', '题目3']
                        if (test.value.includes(genTestField[n])) {
                            stateStore.currentGenTestField = genTestField[n]
                            n++
                        }
                    } catch (err) {
                        console.log(err)
                    }
                    // console.log(test.value)
                }
            })
        }
        // console.log(message.value)
        //
        // message.value = response.choices[0].message.content
    }

    return {
        getResponse,
        getCase,
        getStory,
        getTest,
    }
}

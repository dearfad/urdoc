export default function () {
    const apiKey = import.meta.env.VITE_BIGMODEL_API_KEY
    const modelStore = useModelStore()
    const { simModel } = storeToRefs(modelStore)

    const stateStore = useStateStore()
    const { currentGenCaseField, currentGenTestField } = storeToRefs(stateStore)

    const message = ref('')

    async function getResponse(messages) {
        message.value = ''
        const response = await $fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + apiKey,
            },
            body: {
                model: simModel.value,
                messages: messages,
            },
        })
        message.value = response.choices[0].message.content
    }

    async function getCase(messages) {
        message.value = ''
        const response = await $fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + apiKey,
            },
            body: {
                model: simModel.value,
                messages: messages,
                // 流式输出
                stream: true,
            },
            responseType: 'stream',
        })

        let n = 0
        currentGenCaseField.value = ''
        //
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
                        message.value = message.value + content
                        // console.log(message.value)
                        // 更新病例生成状态
                        const genCaseField = [
                            '姓名',
                            '性别',
                            '年龄',
                            '主诉',
                            '现病史',
                            '既往史',
                            '查体',
                            '专科查体',
                            '辅助检查',
                            '诊断',
                            '治疗',
                            '手术',
                            '病理',
                        ]

                        if (message.value.includes(genCaseField[n])) {
                            currentGenCaseField.value = genCaseField[n]
                            n++
                        }
                        //
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
                model: simModel.value,
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
                model: simModel.value,
                messages: messages,
                // 流式输出
                stream: true,
            },
            responseType: 'stream',
        })

        let n = 0
        currentGenTestField.value = ''

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
                            currentGenTestField.value = genTestField[n]
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
        message,
        getResponse,
        getCase,
        getStory,
        getTest,
    }
}

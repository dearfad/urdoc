export default function () {
    const apiKey = import.meta.env.VITE_BIGMODEL_API_KEY
    const modelStore = useModelStore()
    const { simModel } = storeToRefs(modelStore)
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
                // 流式输出
                stream: true,
            },
            responseType: 'stream',
        })

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
    return {
        message,
        getResponse,
    }
}

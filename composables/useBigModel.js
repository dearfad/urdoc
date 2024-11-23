export default function () {
    const apiKey = import.meta.env.VITE_BIGMODEL_API_KEY
    const modelStore = useModelStore()
    const { simModel } = storeToRefs(modelStore)
    const message = ref('')
    async function getResponse(messages) {
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
                // stream: true,
            },
            // responseType: 'stream',
        })

        //
        // Create a new ReadableStream from the response with TextDecoderStream to get the data as text
        // const reader = response.pipeThrough(new TextDecoderStream()).getReader()

        // Read the chunk of data as we get it
        // while (true) {
        //     const { value, done } = await reader.read()

        //     if (done) break
        //     const jsonDataStr = value.split('data: ')[1].trim()
        //     const jsonData = JSON.parse(jsonDataStr)
        //     const content = jsonData.choices[0].delta.content
        //     console.log(content)
        //     message.value = message.value + content
        // }
        // console.log(message.value)
        //
        message.value = response.choices[0].message.content
        console.log(message.value)
    }
    return {
        message,
        getResponse,
    }
}

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
            },
        })
        message.value = response.choices[0].message.content
    }
    return {
        message,
        getResponse,
    }
}

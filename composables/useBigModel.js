export default function () {
  const msg = ref('')
  const apiKey = import.meta.env.VITE_BIGMODEL_API_KEY
  const model = 'glm-4-flash'
  async function getMessage(messages) {
    const response = await $fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: {
        model: model,
        messages: messages,
      },
    })
    console.log(response)
    msg.value = response.choices[0].message.content
  }
  return { msg, getMessage}
}

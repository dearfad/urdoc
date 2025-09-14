export default function () {
  async function getContent(response) {
    const stateStore = useStateStore()
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n\n')
      buffer = lines.pop() || ''
      let data = ''
      for (const line of lines) {
        if (line.startsWith('data: [DONE]')) return
        if (line.startsWith('data: ')) {
          data = line.slice(6)
        } else {
          continue
        }
        try {
          const message = JSON.parse(data)
          const choice = message.choices[0]
          stateStore.modelResponseString.content += choice.delta.content || ''
          stateStore.modelResponseString.reasoning_content += choice.delta.reasoning_content || ''
        } catch (error) {
          console.log('error: ', error.message)
          continue
        }
      }
    }
    return stateStore.modelResponseString
  }
  return { getContent }
}

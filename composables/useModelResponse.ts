import { jsonrepair } from 'jsonrepair'
export default function () {
  async function getResponse(params: ModelParamsType) {
    const stateStore = useStateStore()
    stateStore.modelResponseStream = ''
    stateStore.modelResponseString = ''
    stateStore.modelResponseField = ''
    const lineRegex = /data: (?:\[.*?\]|\{.*?\})/
    let dataFieldPointer = 0
    let tempIncompleteLine = ''

    // Consuming SSE (Server Sent Events) via POST request
    // https://nuxt.com/docs/getting-started/data-fetching

    // Make a POST request to the SSE endpoint
    const response = await $fetch<ReadableStream>('/api/case/create', {
      method: 'POST',
      body: {
        params: params,
      },
      responseType: 'stream',
    })

    // Create a new ReadableStream from the response with TextDecoderStream to get the data as text
    const reader = response.pipeThrough(new TextDecoderStream()).getReader()
    while (true) {
      const { value, done } = await reader.read()
      // console.log('value: ', value)
      // console.log('done: ', done)
      if (done) break

      // DEBUG页面 原始信息流
      stateStore.modelResponseStream += value

      // 解析模型响应数据流
      const lines = value.split('\n\n')

      lines.forEach((line: string) => {
        if (line === '') return
        // fix 单行不完整
        line = tempIncompleteLine + line
        if (lineRegex.test(line)) {
          tempIncompleteLine = ''
        } else {
          tempIncompleteLine = line
          return
        }
        if (line === 'data: [DONE]') return

        const jsonDataStr = line.split('data: ')[1]
        try {
          const jsonData = JSON.parse(jsonDataStr)
          // 临时更改，待阿里云修正stream
          if (params.model === 'deepseek-v3') {
            stateStore.modelResponseString = jsonData.choices[0].message.content
          } else {
            stateStore.modelResponseString += jsonData.choices[0].delta.content
          }
          // 更新当前生成字段
          if (params.watchFields.length > 0) {
            if (stateStore.modelResponseString.includes(params.watchFields[dataFieldPointer])) {
              stateStore.modelResponseField = params.watchFields[dataFieldPointer]
              dataFieldPointer++
            }
          }
        } catch (error) {
          console.log('*******************************************************')
          stateStore.appInfo = `解析模型数据流失败：${error}`
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

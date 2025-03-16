import { jsonrepair } from 'jsonrepair'
export default function () {
  async function getResponse(params: ModelParamsType) {
    const stateStore = useStateStore()
    stateStore.modelResponseStream = ''
    stateStore.modelResponseString = ''
    stateStore.modelResponseField = ''
    const lineRegex = /data: (?:\[.*?\]|\{.*?\})/
    const jsonRegex = /\{.*?\}/s
    let dataFieldPointer = 0
    let tempIncompleteLine = ''

    // Consuming SSE (Server Sent Events) via POST request
    // https://nuxt.com/docs/getting-started/data-fetching

    // Make a POST request to the SSE endpoint
    const response = await $fetch<ReadableStream>('/api/cstar/story/create', {
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
          stateStore.modelResponseString += jsonData.choices[0].delta.content
          // 更新当前生成字段
          if (params.watchFields.length > 0) {
            if (stateStore.modelResponseString.includes(params.watchFields[dataFieldPointer])) {
              stateStore.modelResponseField = params.watchFields[dataFieldPointer]
              dataFieldPointer++
            }
          }
        } catch (error) {
          stateStore.appInfo = `解析模型数据流失败：${error}`
        }
      })
    }

    // 解析modelResponseString的json问题
    if (params.responseFormat.type === 'json_object') {
      try {
        let dataString = stateStore.modelResponseString

        // 去除 ```json ``` 框架
        const matchJson = dataString.match(jsonRegex)
        if (matchJson) dataString = matchJson[0]
        // 替换中文字符 引号 “” 和 逗号 ，
        dataString = dataString.replace(/“/g, '"').replace(/”/g, '"')
        dataString = dataString.replace(/，/g, ',')
        // 其他修复
        dataString = jsonrepair(dataString)

        stateStore.modelResponseString = dataString
      } catch (error) {
        stateStore.appInfo = `修复json格式失败: ${error}`
      }
    }
    // console.log(responseDataStream.value)
    return stateStore.modelResponseString
  }

  return {
    getResponse,
  }
}

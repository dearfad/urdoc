import { jsonrepair } from 'jsonrepair'
export default function () {
  async function getResponse(
    params: ModelParamsType,
    format: 'text' | 'json',
    watchFields: string[] = []
  ) {
    const stateStore = useStateStore()
    stateStore.modelResponseStream = ''
    stateStore.modelResponseString = ''
    stateStore.modelResponseField = ''
    // 匹配以 data: 开头，后面跟着一个 JSON 格式的数组或对象的字符串
    const lineRegex = /data: (?:\[.*\]|\{.*\})/
    // 匹配以 { 开头、以 } 结尾的 JSON 对象格式的内容，并且会匹配其中的所有字符，包括换行符
    const jsonRegex = /\{.*\}/s
    const baiduRegex = /```json.*/s
    let dataFieldPointer = 0
    let tempIncompleteLine = ''
    let jsonData: SseStream
    let dataString = ''

    // Consuming SSE (Server Sent Events) via POST request
    // https://nuxt.com/docs/getting-started/data-fetching

    // Make a POST request to the SSE endpoint
    const response = await $fetch<ReadableStream>('/chat/completions', {
      baseURL: stateStore.apiBaseUrl,
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
        if (line === 'data: [DONE]' || line === 'data: [DONE]\n') return
        const jsonDataStr = line.split('data: ')[1]
        try {
          jsonData = JSON.parse(jsonrepair(jsonDataStr))
          // 更新当前生成内容
          if (!jsonData.choices?.length) return
          stateStore.modelResponseString += jsonData.choices[0].delta.content
          // 更新当前生成字段
          if (watchFields.length > 0) {
            if (stateStore.modelResponseString.includes(watchFields[dataFieldPointer])) {
              stateStore.modelResponseField = watchFields[dataFieldPointer]
              dataFieldPointer++
            }
          }
        } catch (error) {
          console.log('line: ', line)
          console.log('解析模型数据流失败：', jsonData)
          console.log('error: ', error)
          stateStore.appInfo = `解析模型数据流失败：${error}`
        }
      })
    }
    // 解析modelResponseString的json问题
    if (format === 'json') {
      try {
        dataString = stateStore.modelResponseString
        // 去除 baidu 最开始的 {
        const baiduJson = dataString.match(baiduRegex)
        if (baiduJson) dataString = baiduJson[0]
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
        console.log('修复json格式失败: ', dataString)
        stateStore.appInfo = `修复json格式失败: ${error}`
        stateStore.modelResponseString = `{'status':'error', 'data':'${dataString.slice(1, -1)}'}`
      }
    }
    // console.log(responseDataStream.value)
    return stateStore.modelResponseString
  }

  return {
    getResponse,
  }
}

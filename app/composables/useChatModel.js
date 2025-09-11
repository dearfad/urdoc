import { jsonrepair } from 'jsonrepair'
export default function () {
  async function getResponse(payload, format, watchFields) {
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
    let dataString = ''

    const url = `${stateStore.apiBaseUrl}/model/${payload.provider}/${payload.usage}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: payload.apiKey,
        apiKeyName: payload.apiKeyName,
        model: payload.model,
        messages: payload.messages,
        stream: payload.stream,
        format: payload.format,
      }),
    })

    if (response.status !== 200) {
      const errorFromFunction = await response.json()
      stateStore.appInfos.push(errorFromFunction.error.message)
      return
    }

    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      // DEBUG页面 原始信息流
      stateStore.modelResponseStream += value

      // 解析模型响应数据流
      const lines = value.split('\n\n')

      lines.forEach((line) => {
        if (line === '') return
        // 修复单行不完整
        line = tempIncompleteLine + line
        if (lineRegex.test(line)) {
          tempIncompleteLine = ''
        } else {
          tempIncompleteLine = line
          return
        }
        try {
          const message = JSON.parse(line)
          console.log(message)

          // 更新当前生成内容
          stateStore.modelResponseString += message.content || ''

          // 更新当前生成字段
          const currentField = watchFields[dataFieldPointer]
          if (
            watchFields.length > 0 &&
            currentField &&
            stateStore.modelResponseString.includes(currentField)
          ) {
            stateStore.modelResponseField = currentField
            dataFieldPointer++
          }
        } catch (error) {
          // 统一处理修复或解析失败的情况
          // console.log('处理JSON失败: ', jsonDataStr, error)
          // stateStore.appInfo = '处理JSON失败'
          return
        }
      })
    }
    // 解析modelResponseString的json问题
    // if (format === 'json') {
    //   try {
    //     dataString = stateStore.modelResponseString
    //     // 去除 baidu 最开始的 {
    //     const baiduJson = dataString.match(baiduRegex)
    //     if (baiduJson) dataString = baiduJson[0]
    //     // 去除 ```json ``` 框架
    //     const matchJson = dataString.match(jsonRegex)
    //     if (matchJson) dataString = matchJson[0]
    //     // 替换中文字符 引号 “” 和 逗号 ，
    //     dataString = dataString.replace(/“/g, '"').replace(/”/g, '"')
    //     dataString = dataString.replace(/，/g, ',')
    //     // 其他修复
    //     dataString = jsonrepair(dataString)

    //     stateStore.modelResponseString = dataString
    //   } catch (error) {
    //     console.log('修复json格式失败: ', dataString)
    //     stateStore.appInfo = `修复json格式失败: ${error}`
    //     stateStore.modelResponseString = `{'status':'error', 'data':'${dataString.slice(1, -1)}'}`
    //   }
    // }
    // console.log(responseDataStream.value)
    console.log('modelResponseString: ', stateStore.modelResponseString)
    return stateStore.modelResponseString
  }

  return {
    getResponse,
  }
}

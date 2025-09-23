export default function () {
  // const stateStore = useStateStore()
  // const recordStore = useRecordStore()
  // const imageModel = useImageModel()
  // const videoModel = useVideoModel()
  const promptStore = usePromptStore()
  const modelStore = useModelStore()
  // const apiKeyStore = useApiKeyStore()

  // Chat Model
  async function getCase(messages) {
    const model = modelStore.getModel('chat', 'case')
    return await model.getResponse('chat', 'case', messages)
  }
  // async function checkCase(messages) {
  //   const params = getChatModelParams('check', messages, 'json')
  //   return await chatModel.getResponse(params, 'json', recordStore.watchFields.case)
  // }

  async function getStory(messages) {
    const model = modelStore.getModel('chat', 'story')
    return await model.getResponse('chat', 'story', messages)
  }

  // async function getTest(messages) {
  //   const params = getChatModelParams('test', messages, 'json')
  //   return await chatModel.getResponse(params, 'json')
  // }

  // async function getAct(messages) {
  //   const params = getChatModelParams('act', messages, 'text')
  //   return await chatModel.getResponse(params, 'text')
  // }

  // async function getRate(messages) {
  //   const params = getChatModelParams('rate', messages, 'text')
  //   return await chatModel.getResponse(params, 'text')
  // }

  // Image Model
  async function getFace(messages) {
    const chatModel = modelStore.getModel('chat', 'face')
    await chatModel.getResponse('chat', 'face', messages)
    promptStore.prompts.image.face = modelStore.modelResponse.chat.content
    const imageModel = modelStore.getModel('image', 'face')
    return await imageModel.getResponse('image', 'face', promptStore.prompts.image.face)
  }

  // async function getStoryIllustration(messages) {
  //   const illustrationParams = getChatModelParams('illustration', messages, 'text')
  //   const prompt = await chatModel.getResponse(illustrationParams, 'text')
  //   console.log(prompt)
  //   // 使用正则表达式提取方括号内的内容
  //   const content = prompt.match(/(?<=\[)(.*?)(?=\])/)[0]
  //   // 将提取的内容按逗号分割并去除多余的空格
  //   const result = content.split(',').map((item) => item.trim().replace(/'/g, ''))
  //   // console.log(result)
  //   for (const item of result) {
  //     promptStore.prompts.image.illustration = item
  //     const imageParams = getImageModelParams('illustration', item)
  //     const url = await imageModel.getResponse(imageParams)
  //     // console.log(url)
  //     recordStore.record.story.插图.push(url)
  //   }
  //   // console.log(urls)
  //   return
  // }

  // Video Model

  async function getPose(messages) {
    const chatModel = modelStore.getModel('chat', 'pose')
    await chatModel.getResponse('chat', 'pose', messages)
    promptStore.prompts.video.pose = modelStore.modelResponse.chat.content
    const videoModel = modelStore.getModel('video', 'pose')
    return await videoModel.getResponse('video', 'pose', promptStore.prompts.video.pose)
  }

  // Voice Model
  // async function getVoice(text) {
  //   const response = await $fetch(
  //     `https://textreadtts.com/tts/convert?accessKey=FREE&language=chinese&speaker=speaker${stateStore.voiceId}&text=${text}`
  //   )
  //   return response.audio
  // }

  return {
    getCase,
    getStory,
    // getTest,
    // getAct,
    // getRate,
    getFace,
    getPose,
    // getVoice,
    // checkCase,
    // getStoryIllustration,
  }
}

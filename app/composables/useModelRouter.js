export default function () {
  const stateStore = useStateStore()
  const recordStore = useRecordStore()
  // const imageModel = useImageModel()
  // const videoModel = useVideoModel()
  const promptStore = usePromptStore()
  const modelStore = useModelStore()
  // const apiKeyStore = useApiKeyStore()

  // Chat Model
  async function getCase(messages) {
    const provider = modelStore.getProviderComposable('chat', 'case')
    return await provider.getResponse('chat', 'case', messages)
  }
  // async function checkCase(messages) {
  //   const params = getChatModelParams('check', messages, 'json')
  //   return await chatModel.getResponse(params, 'json', recordStore.watchFields.case)
  // }

  async function getStory(messages) {
    const provider = modelStore.getProviderComposable('chat', 'story')
    return await provider.getResponse('chat', 'story', messages)
  }

  async function getConversation(messages) {
    const provider = modelStore.getProviderComposable('chat', 'conversation')
    return await provider.getResponse('chat', 'conversation', messages)
  }

  async function getDiscussion(messages) {
    const provider = modelStore.getProviderComposable('chat', 'discussion')
    return await provider.getResponse('chat', 'discussion', messages)
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
    const chatProvider = modelStore.getProviderComposable('chat', 'face')
    await chatProvider.getResponse('chat', 'face', messages)
    promptStore.prompts.image.face = modelStore.modelResponse.chat.content
    const imageProvider = modelStore.getProviderComposable('image', 'face')
    return await imageProvider.getResponse('image', 'face', promptStore.prompts.image.face)
  }

  async function getStoryIllustration(messages) {
    const chatProvider = modelStore.getProviderComposable('chat', 'illustration')
    await chatProvider.getResponse('chat', 'illustration', messages)
    const prompt = modelStore.modelResponse.chat.content
    // 使用正则表达式提取方括号内的内容
    const content = prompt.match(/(?<=\[)(.*?)(?=\])/)[0]
    // 将提取的内容按逗号分割并去除多余的空格
    const result = content.split(',').map((item) => item.trim().replace(/'/g, ''))

    // for (const item of result) {
    //   promptStore.prompts.image.illustration = item
    //   const imageProvider = modelStore.getProviderComposable('image', 'illustration')
    //   const url = await imageProvider.getResponse(
    //     'image',
    //     'illustration',
    //     promptStore.prompts.image.illustration
    //   )
    //   recordStore.record.story.插图.push(url)
    // }
    // 并发执行所有插图生成任务
    const illustrationPromises = result.map(async (item) => {
      promptStore.prompts.image.illustration = item
      const imageProvider = modelStore.getProviderComposable('image', 'illustration')
      const url = await imageProvider.getResponse(
        'image',
        'illustration',
        promptStore.prompts.image.illustration
      )
      return url
    })

    // 等待所有插图生成完成并收集结果
    const urls = await Promise.all(illustrationPromises)

    // 将所有生成的插图URL添加到记录中
    recordStore.record.story.插图.push(...urls)
    return
  }

  // Video Model

  async function getPose(messages) {
    const chatProvier = modelStore.getProviderComposable('chat', 'pose')
    await chatProvier.getResponse('chat', 'pose', messages)
    promptStore.prompts.video.pose = modelStore.modelResponse.chat.content
    const videoProvider = modelStore.getProviderComposable('video', 'pose')
    return await videoProvider.getResponse('video', 'pose', promptStore.prompts.video.pose)
  }

  // Voice Model
  async function getVoice(messages) {
    const response = await $fetch(
      `https://textreadtts.com/tts/convert?accessKey=FREE&language=chinese&speaker=speaker${stateStore.voiceId}&text=${messages}`
    )
    return response.audio
  }

  async function getDialogue(messages) {
    const provider = modelStore.getProviderComposable('audio', 'dialogue')
    return await provider.getResponse('audio', 'dialogue', messages)
  }

  return {
    getCase,
    getStory,
    getConversation,
    getDiscussion,

    // getTest,
    // getAct,
    // getRate,
    getFace,
    getPose,
    getVoice,
    getDialogue,
    // checkCase,
    getStoryIllustration,
  }
}

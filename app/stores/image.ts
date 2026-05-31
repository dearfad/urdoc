import { DefaultChatTransport } from 'ai'
import { Chat } from '@ai-sdk/vue'

const VERSION = '2026-05-29'

export const useImageStore = defineStore('image', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:image')
  const image = ref()

  const chat = new Chat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onError: (error) => {
      useStateStore().toast.add({
        title: '生成失败',
        description: error.message,
        color: 'error',
        icon: 'i-lucide-alert-circle',
      })
    },
  })

  const status = computed(() => chat.status === 'idle' ? 'ready' : chat.status)

  function reset() {
    image.value = undefined
  }

  function generate() {
    const stateStore = useStateStore()
    if (chat.status === 'error') chat.clearError()
    chat.stop()
    chat.sendMessage(
      { text: '生成一张图片' },
      {
        body: {
          type: 'image',
          task: 'generate',
          model: useModelStore().activeModels.image,
          reasoning: false,
        },
      },
    )
  }

  return { version, image, reset, generate, status }
})

// export default function () {
//   async function getResponse(params) {
//     const stateStore = useStateStore()
//     const recordStore = useRecordStore()
//     stateStore.modelResponseField = '头像'
//     const body = params.body ? JSON.parse(params.body) : {}
//     console.log(body.model)
//     if (body.model === 'cogview-3-flash') {
//       const response = await $fetch('/model/image', {
//         baseURL: stateStore.apiBaseUrl,
//         method: 'POST',
//         body: {
//           params: params,
//         },
//         ignoreResponseError: true,
//       })
//       if (response.error) {
//         stateStore.appInfos.push(response.error.message)
//         return '/heroimage.png'
//       }
//       return response.data?.[0]?.url
//     }
//     if (body.model === 'google/gemini-2.5-flash-image-preview:free') {
//       params.body = JSON.stringify({
//         model: body.model,
//         messages: [
//           {
//             role: 'user',
//             content: [
//               { type: 'text', text: '生成一张符合下面描述图片，' + body.prompt },
//               {
//                 type: 'image_url',
//                 image_url: {
//                   url: recordStore.record.face,
//                 },
//               },
//             ],
//           },
//         ],
//         modalities: ['image', 'text'],
//       })
//       const response = await $fetch('/model/chat', {
//         baseURL: stateStore.apiBaseUrl,
//         method: 'POST',
//         body: {
//           params: params,
//         },
//         // ignoreResponseError: true,
//       })
//       if (response.error) {
//         stateStore.appInfos.push(response.error.message)
//         return '/heroimage.png'
//       }
//       // return response.data?.[0]?.url
//       console.log(response)
//       const images = response.choices[0].message.images
//       console.log(images[0].image_url.url)
//       const url = images[0].image_url.url
//       return url
//     }
//   }

//   return {
//     getResponse,
//   }
// }

//================================
// async function getStoryIllustration(messages) {
//     const chatProvider = modelStore.getProviderComposable('chat', 'illustration')
//     await chatProvider.getResponse('chat', 'illustration', messages)
//     const prompt = modelStore.modelResponse.chat.content
//     // 使用正则表达式提取方括号内的内容
//     const content = prompt.match(/(?<=\[)(.*?)(?=\])/)[0]
//     // 将提取的内容按逗号分割并去除多余的空格
//     const result = content.split(',').map((item) => item.trim().replace(/'/g, ''))

//     for (const item of result) {
//       // promptStore.prompts.image.illustration = item
//       const imageProvider = modelStore.getProviderComposable('image', 'illustration')
//       const url = await imageProvider.getResponse(
//         'image',
//         'illustration',
//         recordStore.record.case.姓名 + '，' + item
//       )

//       const fetchImageToBase64ApiUrl = `${stateStore.apiBaseUrl}/utils/fetchImageToBase64`
//       const response = await fetch(fetchImageToBase64ApiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           imgUrl: url,
//         }),
//       })

//       recordStore.record.story.illustration.push({
//         title: item,
//         url: await response.text(),
//       })
//     }

//     // 并发执行所有插图生成任务
//     // const illustrationPromises = result.map(async (item) => {
//     //   promptStore.prompts.image.illustration = item
//     //   const imageProvider = modelStore.getProviderComposable('image', 'illustration')
//     //   const url = await imageProvider.getResponse('image', 'illustration', item)
//     //   return url
//     // })

//     // // 等待所有插图生成完成并收集结果
//     // const urls = await Promise.all(illustrationPromises)

//     // // 将所有生成的插图URL添加到记录中
//     // recordStore.record.story.illustration.push(...urls)

// // Image Model
// async function getFace(messages) {
//   const chatProvider = modelStore.getProviderComposable('chat', 'face')
//   await chatProvider.getResponse('chat', 'face', messages)
//   promptStore.prompts.image.face = modelStore.modelResponse.chat.content
//   const imageProvider = modelStore.getProviderComposable('image', 'face')
//   const imgUrl = await imageProvider.getResponse('image', 'face', promptStore.prompts.image.face)

//   const fetchImageToBase64ApiUrl = `${stateStore.apiBaseUrl}/utils/fetchImageToBase64`
//   const response = await fetch(fetchImageToBase64ApiUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       imgUrl: imgUrl,
//     }),
//   })
//   return await response.text()
// }

//============================================================
// export const useProviderModelScope = () => {
//   const FREE_API_KEY_NAME = 'ZHIPU_API_KEY'
//   const USER_API_KEY_NAME = 'USER_MODELSCOPE_API_KEY'
//   const API_BASE = 'https://api-inference.modelscope.cn/v1'
//   const CHAT_COMPLETIONS = '/chat/completions'
//   const IMAGES_GENERATIONS = '/images/generations'

//   const stateStore = useStateStore()
//   const modelStore = useModelStore()
//   const apiKeyStore = useApiKeyStore()

//   async function getResponse(modelType, modelUsage, messages) {
//     if (modelType === 'chat') return await getChatResponse(modelUsage, messages)
//     if (modelType === 'image') return await getImageResponse(modelUsage, messages)
//     stateStore.appInfos.push('Model Type NOT Supported')
//     return
//   }

//   async function getStreamContent(modelUsage, response) {
//     const { parse } = await import('partial-json')
//     const modelResponseStream = {
//       content: '',
//       reasoning_content: '',
//     }
//     const reader = response.body.getReader()
//     const decoder = new TextDecoder('utf-8')
//     let buffer = ''
//     while (true) {
//       const { done, value } = await reader.read()
//       if (done) break
//       buffer += decoder.decode(value, { stream: true })
//       const lines = buffer.split('\n\n')
//       buffer = lines.pop() || ''
//       let data = ''
//       for (const line of lines) {
//         if (line.startsWith('data: [DONE]')) break
//         if (line.startsWith('data: ')) {
//           data = line.slice(6)
//         } else {
//           continue
//         }
//         try {
//           const message = JSON.parse(data)
//           const choice = message.choices[0]
//           modelResponseStream.content += choice.delta.content ? choice.delta.content : ''
//           modelResponseStream.reasoning_content += choice.delta.reasoning_content
//             ? choice.delta.reasoning_content
//             : ''
//           if (['case', 'test'].includes(modelUsage)) {
//             modelStore.modelResponse.chat.reasoning_content = modelResponseStream.reasoning_content
//               ? modelResponseStream.reasoning_content
//               : ''
//             modelStore.modelResponse.chat.content = modelResponseStream.content.trim()
//               ? parse(modelResponseStream.content)
//               : ''
//           } else {
//             modelStore.modelResponse.chat.reasoning_content = modelResponseStream.reasoning_content
//             modelStore.modelResponse.chat.content = modelResponseStream.content
//           }
//         } catch (error) {
//           console.log('error: ', error.message)
//           continue
//         }
//       }
//     }

//     return modelStore.modelResponse
//   }

//   async function getChatResponse(modelUsage, messages) {
//     modelStore.modelResponse.chat.content = ''
//     modelStore.modelResponse.chat.reasoning_content = ''
//     const chatModel =
//       modelStore.activeModels.chat[modelUsage] || modelStore.activeModels.chat.default
//     const payload = {
//       url: `${API_BASE}${CHAT_COMPLETIONS}`,
//       apiKey: chatModel.source === 'free' ? '' : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKey,
//       apiKeyName:
//         chatModel.source === 'free'
//           ? FREE_API_KEY_NAME
//           : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKeyName,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       method: 'POST',
//       body: {
//         model: chatModel.model,
//         messages: messages,
//         stream: true,
//         // response_format: modelUsage === 'case' ? { type: 'json_object' } : { type: 'text' },
//       },
//     }
//     // if (chatModel.thinking) {
//     //   payload.body.thinking = {
//     //     type: stateStore.isModelThinking ? 'enabled' : 'disabled',
//     //   }
//     // }

//     const url = `${stateStore.apiBaseUrl}/model/proxy`
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     })

//     if (response.status !== 200) {
//       const errorFromModel = await response.json()
//       stateStore.appInfos.push(errorFromModel.error.message)
//       return
//     }

//     await getStreamContent(modelUsage, response)
//   }

//   async function getImageResponse(modelUsage, messages) {
//     modelStore.modelResponse.image.url = ''
//     const imageModel =
//       modelStore.activeModels.image[modelUsage] || modelStore.activeModels.image.default
//     const payload = {
//       url: `${API_BASE}${IMAGES_GENERATIONS}`,
//       apiKey: imageModel.source === 'free' ? '' : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKey,
//       apiKeyName:
//         imageModel.source === 'free'
//           ? FREE_API_KEY_NAME
//           : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKeyName,
//       headers: {
//         'Content-Type': 'application/json',
//         'X-ModelScope-Async-Mode': 'true',
//       },
//       method: 'POST',
//       body: {
//         model: imageModel.model,
//         prompt: messages,
//         // quality: 'standard',
//         size: '1024x1024',
//         // watermark_enabled: true,
//       },
//     }

//     const url = `${stateStore.apiBaseUrl}/model/proxy`
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     })

//     if (response.status !== 200) {
//       const errorFromModel = await response.json()
//       stateStore.appInfos.push(errorFromModel.error.message)
//       return
//     }
//     const task = await response.json()
//     const taskId = task.task_id
//     const taskUrl = `${API_BASE}/tasks/${taskId}`
//     while (true) {
//       const result = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           url: taskUrl,
//           apiKey:
//             imageModel.source === 'free' ? '' : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKey,
//           apiKeyName:
//             imageModel.source === 'free'
//               ? FREE_API_KEY_NAME
//               : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKeyName,
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-ModelScope-Task-Type': 'image_generation',
//           },
//         }),
//       })
//       const data = await result.json()
//       if (data['task_status'] === 'SUCCEED') {
//         modelStore.modelResponse.image.url = data['output_images'][0]
//         break
//       }
//       if (data['task_status'] == 'FAILED') {
//         console.log('Image Generation Failed.')
//         stateStore.appInfos.push(`图片生成失败：${data['errors'].message}`)
//         break
//       }
//       await new Promise((resolve) => setTimeout(resolve, 1000))
//     }
//     return modelStore.modelResponse.image.url
//   }

//   return {
//     getResponse,
//   }
// }

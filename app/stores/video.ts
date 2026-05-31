import { DefaultChatTransport } from 'ai'
import { Chat } from '@ai-sdk/vue'

const VERSION = '2026-05-29'

export const useVideoStore = defineStore('video', () => {
  const version = ref(VERSION)
  syncStoreVersion(VERSION, 'pinia:video')
  const video = ref()

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
    video.value = undefined
  }

  function generate() {
    if (chat.status === 'error') chat.clearError()
    chat.stop()
    chat.sendMessage(
      { text: '生成视频' },
      {
        body: {
          type: 'video',
          task: 'generate',
          model: useModelStore().activeModels.video,
          reasoning: false,
        },
      },
    )
  }

  return { version, video, reset, generate, status }
})

// export default function () {
//   async function getResponse(params) {
//     const stateStore = useStateStore()
//     stateStore.modelResponseField = '姿态'
//     const response = await $fetch('/fetch', {
//       baseURL: stateStore.apiBaseUrl,
//       method: 'POST',
//       body: {
//         params: params,
//       },
//     })
//     return response.id
//   }

//   async function getUrl(id) {
//     const stateStore = useStateStore()
//     stateStore.modelResponseField = '姿态'
//     const params = {
//       url: `https://open.bigmodel.cn/api/paas/v4/async-result/${id}`,
//       method: 'GET',
//       apiKeyName: 'ZHIPU_API_KEY',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }
//     const response = await $fetch('/fetch', {
//       baseURL: stateStore.apiBaseUrl,
//       method: 'POST',
//       body: {
//         params: params,
//       },
//     })
//     // 根据 model.id 选择对应的配置
//     if (response.video_result) {
//       return response.video_result[0].url
//     } else {
//       return ''
//     }
//   }

//   return {
//     getResponse,
//     getUrl,
//   }
// }

//====================================================
// Website: https://bigmodel.cn
// Docs: https://docs.bigmodel.cn
// export const useProviderBigModel = () => {
//   const FREE_API_KEY_NAME = 'ZHIPU_API_KEY'
//   const USER_API_KEY_NAME = 'USER_BIGMODEL_API_KEY'
//   const API_BASE = 'https://open.bigmodel.cn/api/paas/v4'
//   const CHAT_COMPLETIONS = '/chat/completions'
//   const IMAGES_GENERATIONS = '/images/generations'
//   const VIDEOS_GENERATIONS = '/videos/generations'
//   const ASYNC_RESULT = '/async-result'

//   const stateStore = useStateStore()
//   const modelStore = useModelStore()
//   const apiKeyStore = useApiKeyStore()
//   const recordStore = useRecordStore()

//   async function getResponse(modelType, modelUsage, messages) {
//     if (modelType === 'chat') return await getChatResponse(modelUsage, messages)
//     if (modelType === 'image') return await getImageResponse(modelUsage, messages)
//     if (modelType === 'video') return await getVideoResponse(modelUsage, messages)
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
//         response_format: ['case', 'test'].includes(modelUsage)
//           ? { type: 'json_object' }
//           : { type: 'text' },
//       },
//     }
//     if (chatModel.thinking) {
//       payload.body.thinking = {
//         type: stateStore.isModelThinking ? 'enabled' : 'disabled',
//       }
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
//       },
//       method: 'POST',
//       body: {
//         model: imageModel.model,
//         prompt: messages,
//         // quality: 'standard',
//         // size: '1024x1024',
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
//     const content = await response.json()
//     if (!content.data) {
//       stateStore.appInfos.push(content.error.message)
//       return
//     }
//     modelStore.modelResponse.image.url = content.data[0].url || ''
//     return modelStore.modelResponse.image.url
//   }

//   async function getVideoResponse(modelUsage, messages) {
//     modelStore.modelResponse.video.url = ''
//     const videoModel =
//       modelStore.activeModels.video[modelUsage] || modelStore.activeModels.video.default
//     const payload = {
//       url: `${API_BASE}${VIDEOS_GENERATIONS}`,
//       apiKey: videoModel.source === 'free' ? '' : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKey,
//       apiKeyName:
//         videoModel.source === 'free'
//           ? FREE_API_KEY_NAME
//           : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKeyName,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       method: 'POST',
//       body: {
//         model: videoModel.model,
//         prompt: messages,
//         image_url: recordStore.record.face,
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
//     const content = await response.json()
//     const taskId = content.id || ''
//     if (!taskId) {
//       stateStore.appInfos.push(content.error.message)
//       return
//     }
//     const taskUrl = `${API_BASE}${ASYNC_RESULT}/${taskId}`
//     while (true) {
//       const result = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           url: taskUrl,
//           apiKey:
//             videoModel.source === 'free' ? '' : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKey,
//           apiKeyName:
//             videoModel.source === 'free'
//               ? FREE_API_KEY_NAME
//               : apiKeyStore.apiKeys[USER_API_KEY_NAME]?.apiKeyName,
//           method: 'GET',
//           headers: {},
//           body: { model: videoModel.model },
//         }),
//       })
//       const data = await result.json()

//       if (data['task_status'] === 'SUCCESS') {
//         modelStore.modelResponse.video.url = data.video_result[0].url
//         modelStore.modelResponse.video.cover_image_url = data.video_result[0].cover_image_url
//         break
//       }

//       if (data['task_status'] === 'FAIL') {
//         console.log('Image Generation Failed.')
//         break
//       }

//       if (data['error']) {
//         stateStore.appInfos.push(data.error.message)
//         break
//       }

//       await new Promise((resolve) => setTimeout(resolve, 5000))
//     }
//     return modelStore.modelResponse.video
//   }

//   return {
//     getResponse,
//   }
// }

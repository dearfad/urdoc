import { streamText, convertToModelMessages } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

export default defineEventHandler(async (event) => {
  const { messages, providerName, modelName, apiKeyName, baseURL } = await readBody(event)
  const config = useRuntimeConfig()
  const provider = createOpenAICompatible({
    name: providerName,
    apiKey: config[apiKeyName],
    baseURL: baseURL,
  })

  return streamText({
    model: provider(modelName),
    messages: await convertToModelMessages(messages),
    providerOptions: {
      InternAi: { thinking_mode: false },
    },
  }).toUIMessageStreamResponse()
})

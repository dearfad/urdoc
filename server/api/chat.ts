import { streamText, convertToModelMessages } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { getPrompt } from '#server/prompts'

export default defineEventHandler(async (event) => {
  const { messages, providerName, modelName, apiKeyName, baseURL, type, task, reasoning } = await readBody(event)
  const config = useRuntimeConfig()
  const provider = createOpenAICompatible({
    name: providerName,
    apiKey: config[apiKeyName],
    baseURL: baseURL,
  })

  return streamText({
    model: provider(modelName),
    system: await getPrompt(type, task),
    messages: await convertToModelMessages(messages),
    providerOptions: {
      InternAi: { thinking_mode: reasoning },
    },
  }).toUIMessageStreamResponse()
})

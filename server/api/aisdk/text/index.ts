import { streamText, convertToModelMessages } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

export default defineEventHandler(async (event) => {
  const { messages, model, system, providerOptions } = await readBody(event)
  const config = useRuntimeConfig()
  const provider = createOpenAICompatible({
    name: model.provider,
    apiKey: config[model.apiKey as string] as string,
    baseURL: model.baseURL,
  })
  return streamText({
    model: provider(model.name),
    system,
    messages: await convertToModelMessages(messages),
    providerOptions,
  }).toUIMessageStreamResponse()
})

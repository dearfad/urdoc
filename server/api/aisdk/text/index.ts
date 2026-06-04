import { streamText, generateText, convertToModelMessages } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

export default defineEventHandler(async (event) => {
  const { messages, model, system, providerOptions, mode } = await readBody(event)
  const config = useRuntimeConfig()
  const provider = createOpenAICompatible({
    name: model.provider,
    apiKey: config[model.apiKey as string] as string,
    baseURL: model.baseURL,
  })
  if (mode === 'text') {
    const { text } = await generateText({
      model: provider(model.name),
      system,
      messages,
      providerOptions,
    })
    return { result: text }
  }
  return streamText({
    model: provider(model.name),
    system,
    messages: await convertToModelMessages(messages),
    providerOptions,
  }).toUIMessageStreamResponse()
})

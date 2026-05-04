import { streamText, convertToModelMessages } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { getPrompt } from '#server/prompts'

export default defineEventHandler(async (event) => {
  const { messages, model, type, task, reasoning } = await readBody(event)
  const config = useRuntimeConfig()
  const provider = createOpenAICompatible({
    name: model.provider,
    apiKey: config[model.apiKey],
    baseURL: model.baseURL,
  })

  return streamText({
    model: provider(model.name),
    system: await getPrompt(type, task),
    messages: await convertToModelMessages(messages),
    providerOptions: {
      InternAi: { thinking_mode: reasoning },
    },
  }).toUIMessageStreamResponse()
})

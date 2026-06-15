import { streamText, generateText, convertToModelMessages } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

export async function handle(body: {
  messages: any[]
  model: { provider: string; apiKey: string; baseURL: string; name: string }
  system?: string
  providerOptions?: Record<string, unknown>
  stream?: boolean
}) {
  const { messages, model, system, providerOptions, stream = true } = body
  const config = useRuntimeConfig()
  const provider = createOpenAICompatible({
    name: model.provider,
    apiKey: config[model.apiKey as string] as string,
    baseURL: model.baseURL,
  })
  if (stream === false) {
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
}

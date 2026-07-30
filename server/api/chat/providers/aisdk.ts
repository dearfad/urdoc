import {
  streamText,
  generateText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
} from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

export async function handle(body: {
  messages: any[]
  model: { provider: string; apiKey: string; baseURL: string; name: string }
  instructions?: string
  providerOptions?: Record<string, Record<string, any>>
  stream?: boolean
}) {
  const { messages, model, instructions, providerOptions, stream = true } = body
  const config = useRuntimeConfig()
  const provider = createOpenAICompatible({
    name: model.provider,
    apiKey: config[model.apiKey as string] as string,
    baseURL: model.baseURL,
  })
  const normalizedMessages = (messages ?? []).map((m: any) => {
    if (m.parts) return m
    return {
      id: m.id || crypto.randomUUID(),
      role: m.role,
      parts: [{ type: 'text', text: m.content ?? '' }],
    }
  })
  const converted = await convertToModelMessages(normalizedMessages)
  if (stream === false) {
    const { text } = await generateText({
      model: provider(model.name),
      instructions,
      messages: converted,
      providerOptions,
    })
    return { result: text }
  }
  const result = streamText({
    model: provider(model.name),
    instructions,
    messages: converted,
    providerOptions,
  })
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}

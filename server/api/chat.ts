import { streamText, convertToModelMessages } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const provider = createOpenAICompatible({
    name: 'InternAi',
    apiKey: process.env.DEARFAD_SHUSHENG_API_KEY,
    baseURL: 'https://chat.intern-ai.org.cn/api/v1',
  })

  return streamText({
    model: provider('intern-s1'),
    maxOutputTokens: 10000,
    system: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
  }).toUIMessageStreamResponse()
})

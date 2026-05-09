import { streamText, convertToModelMessages } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { getPrompt } from '#server/prompts'

export default defineEventHandler(async (event) => {
  const { messages, model, type, task, reasoning, case: caseContent } = await readBody(event)
  const config = useRuntimeConfig()
  const provider = createOpenAICompatible({
    name: model.provider,
    apiKey: config[model.apiKey],
    baseURL: model.baseURL,
  })

  let systemPrompt = await getPrompt(type, task)

  if (type === 'act' && caseContent) {
    systemPrompt = `${systemPrompt}\n\n病例内容：${JSON.stringify(caseContent)}`
  }

  return streamText({
    model: provider(model.name),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    providerOptions: {
      InternAi: { thinking_mode: reasoning },
      BigModel: {
        thinking: {
          type: reasoning ? 'enabled' : 'disabled',
        },
      },
      OpenRouter: {
        reasoning: {
          effort: reasoning ? 'high' : 'none',
        },
      },
    },
  }).toUIMessageStreamResponse()
})

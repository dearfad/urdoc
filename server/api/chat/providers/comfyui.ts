import { createUIMessageStream, createUIMessageStreamResponse } from 'ai'
import { comfyFetch, formatExecutionError, normalizeComfyBase, submitPrompt } from '../../image/providers/comfyui'
import { resolveChatTemplate } from './templates'

// 本机 ComfyUI 文本生成 provider：把 TextGenerate 工作流的输出接回 /api/chat 契约。
// 复用图像侧的本机地址校验、/prompt 提交与执行错误解析；ComfyUI 没有 token 流，
// 因此等待工作流完成后一次性写出合法的 AI SDK UI Message Stream（start → text → finish）。

const POLL_INTERVAL_MS = 1000
const POLL_TIMEOUT_MS = 10 * 60 * 1000
const PROMPT_PLACEHOLDER = '{{URDOC_PROMPT}}'
const TEXT_ID = 'comfy-text'

interface ChatComfyBody {
  messages: any[]
  model: { provider?: string; name?: string; apiKey?: string; baseURL?: string }
  instructions?: string
  stream?: boolean
  template?: string
}

// /api/chat 的 messages 同时存在 UIMessage（parts）与简写（content）两种形态
function messageText(message: any): string {
  if (typeof message?.content === 'string') return message.content
  const parts = Array.isArray(message?.parts)
    ? message.parts
    : Array.isArray(message?.content)
      ? message.content
      : []
  return parts
    .map((part: any) => {
      if (typeof part === 'string') return part
      return part?.type === 'text' ? String(part?.text ?? '') : ''
    })
    .filter(Boolean)
    .join('\n')
}

// 工作流只有一个 prompt 输入框：把系统指令与多轮对话拼成一段文本，
// 由 TextGenerate 的 use_default_template 套用 Qwen chat template
function buildPrompt(messages: any[], instructions?: string): string {
  const parts: string[] = []
  const system = String(instructions ?? '').trim()
  if (system) parts.push(`【系统指令】\n${system}`)
  for (const message of Array.isArray(messages) ? messages : []) {
    const text = messageText(message).trim()
    if (!text) continue
    const role = String(message?.role ?? 'user')
    const label = role === 'assistant' ? '助手' : role === 'system' ? '系统' : '用户'
    parts.push(`【${label}】\n${text}`)
  }
  return parts.join('\n\n')
}

function applyWorkflowParams(workflow: Record<string, any>, prompt: string): void {
  const seed = Math.floor(Math.random() * 2 ** 31)
  let injected = 0
  for (const node of Object.values(workflow) as any[]) {
    const inputs = node?.inputs
    if (!inputs) continue
    if (typeof inputs.prompt === 'string') {
      inputs.prompt = inputs.prompt.includes(PROMPT_PLACEHOLDER)
        ? inputs.prompt.split(PROMPT_PLACEHOLDER).join(prompt)
        : prompt
      injected++
    }
    // sampling_mode.seed 等数值槽与其它模板共用同一个随机种子
    for (const [key, value] of Object.entries(inputs) as [string, any][]) {
      const isSeedKey = key === 'seed' || key === 'noise_seed' || key.endsWith('.seed')
      if (isSeedKey && typeof value === 'number') inputs[key] = seed
    }
  }
  if (!injected) {
    throw createError({
      statusCode: 400,
      statusMessage: '本地文本生成模板中未找到可写入提示词的节点，请检查工作流',
    })
  }
}

// PreviewAny 的 /history 输出形如 { "5": { "text": ["生成文本"] } }
function collectText(outputs: any): string {
  const candidates: string[] = []
  for (const node of Object.values(outputs ?? {}) as any[]) {
    for (const key of ['text', 'string', 'result', 'value']) {
      const value = node?.[key]
      if (typeof value === 'string' && value.trim()) candidates.push(value.trim())
      else if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'string' && item.trim()) candidates.push(item.trim())
        }
      }
    }
  }
  return candidates.length ? candidates[candidates.length - 1]! : ''
}

async function waitForText(base: string, promptId: string): Promise<string> {
  const deadline = Date.now() + POLL_TIMEOUT_MS
  while (Date.now() < deadline) {
    const res = await comfyFetch(base, `/history/${encodeURIComponent(promptId)}`)
    const history: any = await res.json()
    const item = history?.[promptId]
    if (item?.status?.status_str === 'error') {
      throw createError({ statusCode: 502, statusMessage: formatExecutionError(item) })
    }
    const text = collectText(item?.outputs)
    if (text) return text
    if (item?.status?.completed) {
      throw createError({
        statusCode: 502,
        statusMessage: 'ComfyUI 已完成执行但未返回文本，请检查工作流的 PreviewAny 输出节点',
      })
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }
  throw createError({ statusCode: 504, statusMessage: 'ComfyUI 文本生成超时（10 分钟），请检查队列与显存状态' })
}

async function generateComfyText(body: ChatComfyBody): Promise<string> {
  const base = normalizeComfyBase(String(body.model?.baseURL ?? ''))
  const promptText = buildPrompt(body.messages, body.instructions)
  if (!promptText) {
    throw createError({ statusCode: 400, statusMessage: 'prompt 不能为空' })
  }
  const workflow = resolveChatTemplate(body.template)
  applyWorkflowParams(workflow, promptText)
  const promptId = await submitPrompt(base, workflow)
  return waitForText(base, promptId)
}

export async function handle(body: ChatComfyBody) {
  const text = await generateComfyText(body)
  // 三处提示词改写调用使用 stream: false，保持 { result } 契约
  if (body.stream === false) return { result: text }

  // 其余调用走 Chat transport，必须返回 AI SDK v7 的 UI Message Stream
  const stream = createUIMessageStream({
    execute({ writer }) {
      writer.write({ type: 'start' })
      writer.write({ type: 'text-start', id: TEXT_ID })
      writer.write({ type: 'text-delta', id: TEXT_ID, delta: text })
      writer.write({ type: 'text-end', id: TEXT_ID })
      writer.write({ type: 'finish' })
    },
  })
  return createUIMessageStreamResponse({ stream })
}

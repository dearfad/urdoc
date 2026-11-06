import type { RecordStepKey } from '~/types/record'
import { DEFAULT_ORDER, SECTION_LIMIT, collectExistingContent, type ContentSection } from '~/utils/recordContent'
import { usePromptStore } from '~/stores/prompt'
import { useRecordStore } from '~/stores/record'

// 所有生成入口共用的上下文规则：与生成顺序解耦，允许任意顺序与资料缺失
export const CONTEXT_RULES = `## 上下文使用规则
- 「已有资料」中列出的是本系统此刻已经生成并保存的内容，按当前设定的生成顺序排列；资料可能不完整，也可能来自不同的生成顺序。
- 只依据已有资料进行创作：不得臆造资料中不存在的事实、姓名、诊断、数据或结论；确需补充时，只能做概括性的、与已有资料不冲突的合理假设。
- 若某类资料缺失，不要拒绝生成，也不要在结果中说明「资料不足」；忽略缺失部分，依据现有资料完成本步骤的输出。
- 人物、疾病、时间线、术语等要素必须与已有资料保持一致；已有资料之间存在差异时，以本步骤最相关的内容为准。
- 严格遵守基础提示词规定的输出格式，不因资料缺失或顺序变化而改变格式。`

const DEFAULT_TOTAL_LIMIT = 12000

export interface ContextSectionInput {
  title: string
  content: string
}

export interface BuildContextOptions {
  // 内置提示词与用户自定义提示词的键
  type: string
  task: string
  // 当前正在生成的步骤，收集上下文时排除自身，避免把旧结果当成输入
  target: RecordStepKey | null
  // 该场景原有的要点设定、角色设定、疾病设定等
  hints?: string[]
  // 组件内尚未写入 store 的局部内容，作为补充小节注入
  extra?: ContextSectionInput[]
  // 需要剔除的小节标题，用于同一主项内的子任务避免读到自己的旧结果
  excludeTitles?: string[]
  sectionLimit?: number
  maxTotalLength?: number
}

export interface GenerationContext {
  instructions: string
  text: string
  sections: string[]
}

function formatSections(sections: ContentSection[], maxTotal: number): string[] {
  const result: string[] = []
  let used = 0
  for (const item of sections) {
    const head = `## ${item.title}\n`
    const budget = maxTotal - used - head.length
    if (budget < 200) break
    const body = item.content.length > budget ? `${item.content.slice(0, budget)}\n…（内容已截断）` : item.content
    result.push(head + body)
    used += head.length + body.length
  }
  return result
}

// 唯一的提示词上下文拼装出口：基础提示词 + 通用规则 + 此刻已有的全部内容
export async function buildGenerationContext(options: BuildContextOptions): Promise<GenerationContext> {
  const record = useRecordStore()
  const order = Array.isArray(record.order) ? record.order : DEFAULT_ORDER

  const base = await usePromptStore().getEffectivePrompt(options.type, options.task)
  const excluded = new Set(options.excludeTitles ?? [])
  const collected = collectExistingContent(options.target, order, options.sectionLimit ?? SECTION_LIMIT).filter(
    (item) => !excluded.has(item.title),
  )
  const extra = (options.extra ?? [])
    .filter((item) => item.content?.trim())
    .map((item) => ({ title: item.title, content: item.content.trim() }))
  const sections = formatSections([...collected, ...extra], options.maxTotalLength ?? DEFAULT_TOTAL_LIMIT)

  const sectionText = sections.length
    ? `## 已有资料\n${sections.join('\n\n')}`
    : '## 已有资料\n当前尚无任何已生成的内容。'

  const instructions = [base?.trim(), CONTEXT_RULES, sectionText].filter(Boolean).join('\n\n')

  const hints = (options.hints ?? []).filter((hint) => !!hint?.trim()).join('\n')
  const text = [
    hints,
    '请依据系统提供的已有资料与上下文使用规则完成本次生成，并严格遵守基础提示词中的输出格式。',
  ]
    .filter(Boolean)
    .join('\n\n')

  return { instructions, text, sections }
}

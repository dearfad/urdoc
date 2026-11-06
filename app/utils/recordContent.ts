import type { RecordStepKey, RecordStepMeta } from '~/types/record'
import { useCaseStore } from '~/stores/case'
import { useStoryStore } from '~/stores/story'
import { useTestStore } from '~/stores/test'
import { useActStore } from '~/stores/act'
import { useRateStore } from '~/stores/rate'
import { useImageStore } from '~/stores/image'
import { useVideoStore } from '~/stores/video'
import { useAudioStore } from '~/stores/audio'

// 默认生成顺序：与仪表盘、侧边栏的历史顺序一致
export const DEFAULT_ORDER: RecordStepKey[] = ['case', 'story', 'test', 'act', 'rate', 'image', 'video', 'audio']

export const RECORD_STEP_META: Record<RecordStepKey, RecordStepMeta> = {
  case: {
    key: 'case',
    label: '生成病例',
    icon: 'i-lucide-file-text',
    to: '/cstar/case',
    description: '病史与临床信息',
  },
  story: {
    key: 'story',
    label: '编写故事',
    icon: 'i-lucide-book-open',
    to: '/cstar/story',
    description: '患者叙事脉络',
  },
  test: {
    key: 'test',
    label: '考核理论',
    icon: 'i-lucide-clipboard-check',
    to: '/cstar/test',
    description: '理论题目与作答',
  },
  act: {
    key: 'act',
    label: '互动实践',
    icon: 'i-lucide-message-square',
    to: '/cstar/act',
    description: '模拟问诊与测验',
  },
  rate: {
    key: 'rate',
    label: '评估能力',
    icon: 'i-lucide-bar-chart-3',
    to: '/cstar/rate',
    description: '临床能力评价',
  },
  image: {
    key: 'image',
    label: '图像创作',
    icon: 'i-lucide-image',
    to: '/multimodal/image',
    description: '头像与故事插图',
  },
  video: {
    key: 'video',
    label: '影像渲染',
    icon: 'i-lucide-video',
    to: '/multimodal/video',
    description: '患者影像短片',
  },
  audio: {
    key: 'audio',
    label: '音频合成',
    icon: 'i-lucide-volume-2',
    to: '/multimodal/audio',
    description: '语音与对话音频',
  },
}

// 单节内容的默认长度上限，避免八项内容齐全时提示词膨胀
export const SECTION_LIMIT = 3000

export interface ContentSection {
  title: string
  content: string
}

function asText(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function truncate(text: string, limit: number): string {
  if (!Number.isFinite(limit) || text.length <= limit) return text
  return `${text.slice(0, limit)}\n…（本段内容较长，仅保留前 ${limit} 字）`
}

function section(title: string, value: unknown, limit: number): ContentSection[] {
  const text = asText(value).trim()
  return text ? [{ title, content: truncate(text, limit) }] : []
}

// 读取某个步骤此刻已存在的内容。不依赖生成顺序，缺失内容直接跳过。
export function readStepSections(key: RecordStepKey, limit = SECTION_LIMIT): ContentSection[] {
  switch (key) {
    case 'case': {
      return section('病例内容', useCaseStore().case.content, limit)
    }
    case 'story': {
      const storyStore = useStoryStore()
      return [
        ...section('患者故事', storyStore.story.content, limit),
        ...section('医患对话', storyStore.conversation.content, limit),
        ...section('话题讨论', storyStore.discussion.content, limit),
        ...section('专家点评', storyStore.comment.content, limit),
      ]
    }
    case 'test': {
      const test = useTestStore().test
      const parts: string[] = []
      if (test.content) parts.push(`题目：${asText(test.content)}`)
      if (test.userAnswers) parts.push(`用户答案：${asText(test.userAnswers)}`)
      if (test.score !== null && test.score !== undefined) parts.push(`得分：${test.score}`)
      return parts.length ? [{ title: '理论考核记录', content: truncate(parts.join('\n'), limit) }] : []
    }
    case 'act': {
      const act = useActStore().act
      const parts: string[] = []
      if (act.content?.length) {
        parts.push(
          act.content
            .filter((m) => m.content)
            .map((m) => `${m.role === 'user' ? '医生' : '患者'}：${m.content}`)
            .join('\n'),
        )
      }
      if (act.quiz) {
        const quiz: string[] = [`题目：${asText(act.quiz)}`]
        if (act.userAnswers) quiz.push(`用户答案：${asText(act.userAnswers)}`)
        if (act.quizScore !== null && act.quizScore !== undefined) quiz.push(`得分：${act.quizScore}`)
        parts.push(quiz.join('\n'))
      }
      return parts.length ? [{ title: '互动实践记录', content: truncate(parts.join('\n\n'), limit) }] : []
    }
    case 'rate': {
      return section('能力评估报告', useRateStore().rate.content, limit)
    }
    case 'image': {
      const imageStore = useImageStore()
      const parts: string[] = []
      if (imageStore.prompt?.trim()) parts.push(`自定义描述：${imageStore.prompt.trim()}`)
      if (imageStore.faceOriginalUrls.length) parts.push(`患者头像：已生成 ${imageStore.faceOriginalUrls.length} 张`)
      if (imageStore.generateOriginalUrls.length) {
        parts.push(`创作图像：已生成 ${imageStore.generateOriginalUrls.length} 张`)
      }
      if (imageStore.illustrationOriginalUrls.length) {
        parts.push(`故事插图：已生成 ${imageStore.illustrationOriginalUrls.length} 张`)
      }
      return parts.length ? [{ title: '图像创作结果', content: truncate(parts.join('\n'), limit) }] : []
    }
    case 'video': {
      const videoStore = useVideoStore()
      return videoStore.videoUrl
        ? [{ title: '影像渲染结果', content: truncate(`已生成患者影像：${videoStore.videoUrl}`, limit) }]
        : []
    }
    case 'audio': {
      const audioStore = useAudioStore()
      const texts = Object.keys(audioStore.cache)
      const parts: string[] = []
      if (texts.length) parts.push(`已合成文本：\n${texts.join('\n')}`)
      if (audioStore.audioUrl) parts.push(`当前音频：${audioStore.audioUrl}`)
      return parts.length ? [{ title: '音频合成结果', content: truncate(parts.join('\n'), limit) }] : []
    }
  }
}

// 按当前顺序收集除目标步骤外的全部已有内容；order 缺项时自动补齐，保证自由顺序下不丢上下文
export function collectExistingContent(
  exclude: RecordStepKey | null,
  order: RecordStepKey[],
  limit = SECTION_LIMIT,
): ContentSection[] {
  const keys = [...order, ...DEFAULT_ORDER.filter((key) => !order.includes(key))]
  const sections: ContentSection[] = []
  for (const key of keys) {
    if (key === exclude) continue
    if (!DEFAULT_ORDER.includes(key)) continue
    sections.push(...readStepSections(key, limit))
  }
  return sections
}

// 轻量内容指纹：长度 + 等距采样，避免流式逐 token 更新时对长文本做全量哈希
export function fingerprint(text: string): string {
  if (!text) return ''
  const step = Math.max(1, Math.ceil(text.length / 64))
  let sample = ''
  for (let i = 0; i < text.length; i += step) sample += text[i]
  return `${text.length}:${sample}`
}

// 八个步骤的内容签名。签名使用未截断的完整内容，保证上游细小改动也能被感知。
export function getStepSignatures(): Record<RecordStepKey, string> {
  const result = {} as Record<RecordStepKey, string>
  for (const key of DEFAULT_ORDER) {
    const sections = readStepSections(key, Number.POSITIVE_INFINITY)
    result[key] = fingerprint(sections.map((s) => `${s.title}\n${s.content}`).join('\n\n'))
  }
  return result
}

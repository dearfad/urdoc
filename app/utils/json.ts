import { parse, MalformedJSON } from 'partial-json'

function repairPartialJson(text: string): string {
  let result = ''
  let inString = false
  let i = 0

  while (i < text.length) {
    const ch = text[i]

    if (ch === '\\') {
      result += ch
      i++
      if (i < text.length) {
        result += text[i]
        i++
      }
      continue
    }

    if (ch === '"') {
      if (!inString) {
        inString = true
        result += ch
        i++
        continue
      }

      // 在字符串内部遇到引号，检查是否为内容引号
      let nextIdx = i + 1
      while (nextIdx < text.length && ' \n\r\t'.includes(text.charAt(nextIdx))) {
        nextIdx++
      }
      const nextChar = text.charAt(nextIdx)

      // 后续字符是结构分隔符或到达结尾 → 结束引号
      if (nextIdx >= text.length || ':,}]'.includes(nextChar)) {
        inString = false
        result += ch
        i++
        continue
      }

      // 否则为内容引号，转义为 \"
      result += '\\"'
      i++
      continue
    }

    result += ch
    i++
  }

  return result
}

export function safeParseJson(text: string): any {
  try {
    return parse(text)
  } catch (e) {
    if (e instanceof MalformedJSON) {
      try {
        const repaired = repairPartialJson(text)
        return parse(repaired)
      } catch {
        return null
      }
    }
    return null
  }
}

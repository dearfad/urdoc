import { imageTaskStore } from './store'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = query.id as string

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少任务 ID' })
  }

  const task = imageTaskStore.get(id)

  if (!task) {
    throw createError({ statusCode: 404, statusMessage: '任务未找到' })
  }

  // 清理超过 30 分钟的旧任务
  const now = Date.now()
  for (const [key, t] of imageTaskStore) {
    if (now - t.createdAt > 30 * 60 * 1000) {
      imageTaskStore.delete(key)
    }
  }

  if (task.status === 'succeeded') {
    return { status: 'succeeded', images: task.images }
  }

  if (task.status === 'failed') {
    return { status: 'failed', error: task.error || '生成失败' }
  }

  return { status: 'pending' }
})

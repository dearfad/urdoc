import OSS from 'ali-oss'
export default defineEventHandler(async (event) => {
  const { params } = await readBody(event)

  const client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: process.env.OSS_ALIYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ALIYUN_ACCESS_KEY_SECRET,
    bucket: 'urdoc-avatar',
  })

  const blob = await $fetch(params.url, {
    method: 'GET',
    responseType: 'blob', // 👈 关键
  })
  const buffer = await blob.arrayBuffer()
  const result = await client.put(params.url.split('/').pop(), Buffer.from(buffer))
  return result
})

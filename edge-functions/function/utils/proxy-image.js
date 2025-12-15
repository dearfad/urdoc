export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  // 获取并解码原始图片URL
  const encodedUrl = url.searchParams.get('url')
  if (!encodedUrl) {
    return new Response('Missing url parameter', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  // 关键：URL解码
  const imageUrl = decodeURIComponent(encodedUrl)

  try {
    // 代理请求图片（绕过防盗链）
    const imageResponse = await fetch(imageUrl, {
      headers: {
        Referer: 'https://dev.urdoc.dearfad.com/project/narrative-medicine', // 必填！根据实际情况修改
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!imageResponse.ok) {
      return new Response(`Failed to fetch image: ${imageResponse.status}`, {
        status: imageResponse.status,
      })
    }

    // 返回图片并设置边缘缓存
    return new Response(imageResponse.body, {
      headers: {
        'Content-Type': imageResponse.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable', // 缓存1年
        'Access-Control-Allow-Origin': '*', // 允许跨域
      },
    })
  } catch (error) {
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}

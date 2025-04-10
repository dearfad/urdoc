export async function onRequest() {
  return await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + 'bed2addd0232f7ed3c494c07d3458f00.mQ9GXWD8kRpWObNr',
    },
    body: JSON.stringify({
      model: 'glm-4-flash',
      messages: [{ role: 'user', content: '你好' }],
      stream: true,
    }),
  })
}

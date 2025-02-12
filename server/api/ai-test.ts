export default defineEventHandler(async () => {
  const ai = hubAI() // access AI bindings
  return await ai.run('@cf/microsoft/phi-2', {
    prompt: '请问现在几点了？',
  })
})

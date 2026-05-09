export default function () {
  const stateStore = useStateStore()
  async function database(action: string, record: MedicalRecord | null) {
    return await $fetch('/record/database', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: { action: action, record: record },
    })
  }
  return { database }
}

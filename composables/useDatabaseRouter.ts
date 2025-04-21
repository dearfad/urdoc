export default function () {
  async function saveRecord() {
    const stateStore = useStateStore()
    const recordStore = useRecordStore()

    const response = await $fetch('/database/record', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        record: recordStore.record,
      },
    })
    return response
  }
  return { saveRecord }
}

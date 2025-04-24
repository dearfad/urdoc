export default function () {
  const stateStore = useStateStore()
  const recordStore = useRecordStore()
  async function saveRecord() {
    const response = await $fetch('/database/record', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        method: 'save',
        record: recordStore.record,
      },
    })
    return response
  }

  async function updateRecord() {
    const response = await $fetch('/database/record', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        method: 'update',
        record: recordStore.record,
      },
    })
    return response
  }

  async function listRecord() {
    const response = await $fetch('/database/record', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        method: 'list',
        record: recordStore.record,
      },
    })
    return response
  }

  async function loadRecord() {
    const response = await $fetch('/database/record', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        method: 'delete',
        record: recordStore.record,
      },
    })
    return response
  }

  return { saveRecord, listRecord, loadRecord, updateRecord }
}

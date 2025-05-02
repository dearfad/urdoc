export default function () {
  const stateStore = useStateStore()
  const recordStore = useRecordStore()
  const promptStore = usePromptStore()
  async function insertRecord() {
    const record = {
      id: recordStore.record.id,
      case: recordStore.record.case,
      story: recordStore.record.story,
      test: recordStore.record.test,
    }
    const response = await $fetch('/database/record', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        method: 'insert',
        record: record,
      },
    })
    return response
  }

  async function updateRecord() {
    const record = {
      id: recordStore.record.id,
      case: recordStore.record.case,
      story: recordStore.record.story,
      test: recordStore.record.test,
    }
    const response = await $fetch('/database/record', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        method: 'update',
        record: record,
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
        record: '',
      },
    })
    return response
  }

  async function loadRecord() {
    const response = await $fetch('/database/record', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        method: 'load',
        record: stateStore.listSelectedRecordId[0],
      },
    })
    return response
  }

  async function removeRecord() {
    const response = await $fetch('/database/record', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        method: 'remove',
        record: stateStore.listSelectedRecordId[0],
      },
    })
    return response
  }

  async function operatePrompt(action: string, prompt: SystemPrompt | null) {
    return await $fetch('/database/prompt', {
      baseURL: stateStore.apiBaseUrl,
      method: 'POST',
      body: {
        action: action,
        prompt: prompt,
      },
    })
  }

  return { insertRecord, listRecord, loadRecord, updateRecord, removeRecord, operatePrompt }
}

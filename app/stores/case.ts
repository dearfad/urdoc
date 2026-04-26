const VERSION = '2026-04-26'

const caseDefault = {
  id: 0,
  tags: [],
  textbook: null,
  custom: [],
  content: {
    姓名: '',
    性别: '',
    年龄: '',
    主诉: '',
    现病史: '',
    既往史: '',
    查体: '',
    专科查体: '',
    诊断: '',
    治疗: '',
    手术: '',
    病理: '',
  },
}

export const useCaseStore = defineStore('case', () => {
  const version = ref(VERSION)

  const caseItems = ref<Case>({ ...caseDefault })

  function reset() {
    caseItems.value = { ...caseDefault }
  }

  syncStoreVersion(VERSION, 'pinia:case')
  return { version, case: caseItems, reset }
})

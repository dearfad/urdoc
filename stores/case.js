export const useCaseStore = defineStore('case', () => {
    const caseFields = [
        '姓名',
        '性别',
        '年龄',
        '主诉',
        '现病史',
        '既往史',
        '查体',
        '专科查体',
        '辅助检查',
        '诊断',
        '治疗',
        '手术',
        '病理',
    ]
    const simCase = ref('')
    const simCaseMarkdown = computed(() => {
        let markdown = ''
        for (const key in simCase.value) {
            const value = simCase.value[key]
            markdown += `**${key}**: ${value}\n`
        }
        return markdown
    })
    function clearSimCase() {
        simCase.value = ''
    }
    function updateCase(newCase) {
        simCase.value = newCase
    }
    return { simCase, clearSimCase, caseFields, updateCase, simCaseMarkdown }
})

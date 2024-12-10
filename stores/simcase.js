export const useSimCaseStore = defineStore('simcase', () => {
    const simCase = ref('')
    const simCaseFields = ref([
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
    ])

    const simCaseMarkdown = computed(() => {
        return Object.entries(simCase.value)
            .map(([key, value]) => `**${key}**: ${value}`)
            .join('\n')
    })

    function updateSimCase(value) {
        simCase.value = value
    }

    function deleteSimCase() {
        simCase.value = ''
    }

    return { simCase, simCaseFields, simCaseMarkdown, updateSimCase, deleteSimCase }
})

export const useSimCaseStore = defineStore(
    'simcase',
    () => {
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

        const simCaseText = computed(() => {
            return `患者，${simCase.value.性别}，${simCase.value.年龄}，因${simCase.value.主诉}入院。${simCase.value.现病史}${simCase.value.既往史}查体：${simCase.value.查体}专科查体：${simCase.value.专科查体}辅助检查：${simCase.value.辅助检查}诊断：${simCase.value.诊断}治疗：${simCase.value.治疗}手术：${simCase.value.手术}病理：${simCase.value.病理}`
        })

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

        return {
            simCase,
            simCaseText,
            simCaseFields,
            simCaseMarkdown,
            updateSimCase,
            deleteSimCase,
        }
    },
    {
        persist: {
            pick: ['simCase'],
        },
    }
)

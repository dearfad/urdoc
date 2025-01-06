export const useCaseStore = defineStore(
    'case',
    () => {
        // CSTAR MODEL BASIC FIELDS
        const caseContent = ref({})
        const caseStory = ref('')
        const caseTest = ref('')
        const caseAct = ref([])
        const caseRate = ref('')

        // Media Attachments
        const caseFace = ref('')

        // Watch Generating Fields
        const caseContentFields = ref([
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
        const caseStoryFields = ref([])
        const caseTestFields = ref(['题目1', '题目2', '题目3'])

        // Computed Fields

        // 题目文本格式，考试模式
        const caseContentText = computed(() => {
            if (caseContent.value) {
                let text = `患者，${caseContent.value.性别}，${caseContent.value.年龄}，因${caseContent.value.主诉}入院。${caseContent.value.现病史}${caseContent.value.既往史}查体：${caseContent.value.查体}专科查体：${caseContent.value.专科查体}辅助检查：${caseContent.value.辅助检查}`
                if (caseContent.value.诊断) {
                    text += `诊断：${caseContent.value.诊断}`
                }
                if (caseContent.value.治疗) {
                    text += `治疗：${caseContent.value.治疗}`
                }
                if (caseContent.value.手术) {
                    text += `手术：${caseContent.value.手术}`
                }
                if (caseContent.value.病理) {
                    text += `病理：${caseContent.value.病理}`
                }
                return text
            } else {
                return ''
            }
        })
        // 题目Markdown格式，显示模式
        const caseContentMarkdown = computed(() => {
            return Object.entries(caseContent.value)
                .map(([key, value]) => `**${key}：** ${value}`)
                .join('\n\n')
        })

        // 重置所有数据，例如生成新病例前
        // https://pinia.vuejs.org/zh/core-concepts/state.html
        function $reset() {
            caseContent.value = {}
            caseStory.value = ''
            caseTest.value = ''
            caseAct.value = []
            caseRate.value = ''
            caseFace.value = ''
        }

        return {
            caseContent,
            caseStory,
            caseTest,
            caseAct,
            caseRate,
            caseFace,
            caseContentFields,
            caseStoryFields,
            caseTestFields,
            caseContentText,
            caseContentMarkdown,
            $reset,
        }
    },
    {
        persist: true,
    }
)

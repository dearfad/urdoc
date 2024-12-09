export const useChapterStore = defineStore('chapter', () => {
    const chapter = ref({
        外科学: {
            绪论: { 外科疾病: [], 外科专业分科: [], 怎样学习外科学: [], 外科学发展简史: [] },
            无菌术: {
                '手术器械、物品的灭菌、消毒法': [],
                手术人员和病人手术区域的准备: [],
                手术进行中的无菌原则: [],
                手术室的管理: [],
            },
            '水、电解质代谢紊乱和酸碱平衡失调': {
                概述: [],
                '水、钠代谢紊乱': ['脱水', '水中毒和水肿'],
                钾代谢紊乱: ['低钾血症', '高钾血症'],
                镁及钙磷代谢紊乱: ['镁代谢紊乱', '钙磷代谢紊乱'],
                酸碱平衡失调: [
                    '代谢性酸中毒',
                    '代谢性碱中毒',
                    '呼吸性酸中毒',
                    '呼吸性碱中毒',
                    '混合性酸碱平衡失调',
                ],
            },
            输血: {
                输血的适应症和注意事项: [],
                输血的不良反应及其防治: [],
                自体输血: [],
                血浆代用品: [],
            },
            外科休克: {
                概论: [],
                低血容量性休克: ['失血性休克', '创伤性休克'],
                感染性休克: [],
            },
            麻醉: {
                概述: [],
                麻醉前准备和麻醉前用药: ['麻醉前评估', '麻醉前准备', '麻醉前用药'],
                全身麻醉: [
                    '全身麻醉药',
                    '全身麻醉的实施',
                    '全身麻醉的管理',
                    '全身麻醉的并发症及其防治',
                ],
                局部麻醉: ['局麻药的药理', '局麻方法'],
                椎管内麻醉: [
                    '椎管内麻醉的解剖基础',
                    '椎管内麻醉的机制及生理',
                    '蛛网膜下隙阻滞',
                    '硬脊膜外隙阻滞',
                    '骶管阻滞',
                    '蛛网膜下隙与硬脊膜外隙联合阻滞',
                ],
                麻醉期间和麻醉恢复期的监测和管理: [
                    '麻醉期间的监测和管理',
                    '麻醉恢复期的监测和管理',
                ],
            },
            疼痛治疗: {
                概述: [],
                疼痛对生理的影响: [],
                慢性疼痛治疗: ['慢性疼痛的诊治范围', '治疗疼痛的常用方法', '癌痛治疗'],
                术后镇痛: ['镇痛药物', '镇痛方法'],
            },
            重症监测治疗与复苏: {
                重症监测治疗: ['概述', 'ICU的工作内容', '病情评估', 'ICU的人文关怀'],
                心肺脑复苏: ['基础生命支持', '高级生命支持', '复苏后治疗'],
                急性肾衰竭与急性肾损伤: [],
                急性肝衰竭: [],
            },
            围手术期处理: {
                术前准备: [],
                术后处理: [],
                术后并发症的防治: [],
            },
            外科病人的代谢与营养治疗: {
                外科病人的代谢变化: [],
                营养状况评定: [],
                肠外营养: [],
                肠内营养: [],
                肥胖与代谢病外科: [],
            },
            外科感染: {},
            创伤: {},
            '烧伤、冻伤、蛇咬伤、犬咬伤、虫蜇伤': {},
            肿瘤: {},
            '器官、组织和细胞移植': {},
            外科微创技术: {},
            颅内压增高和脑疝: {},
            颅脑损伤: {},
            颅内和椎管内肿瘤: {},
            颅内和椎管内血管性疾病: {},
            颅脑和脊髓先天畸形: {},
            颈部疾病: {},
            乳房疾病: {
                解剖生理概要: [],
                乳房检查: [],
                '多乳头、多乳房畸形': [],
                急性乳腺炎: [],
                乳腺囊性增生病: [],
                乳房肿瘤: ['乳腺纤维腺瘤', '乳管内乳头状瘤', '乳房肉瘤', '乳腺癌'],
            },
            胸部损伤: {},
            '胸壁、胸膜疾病': {},
            肺疾病: {},
            食管疾病: {},
            原发性纵隔肿瘤: {},
            心脏疾病: {},
            胸主动脉疾病: {},
            腹外疝: {},
            腹部损伤: {},
            急性化脓性腹膜炎: {},
            胃十二指肠疾病: {},
            小肠疾病: {},
            阑尾疾病: {},
            '结、直肠与肛管疾病': {},
            肝疾病: {},
            门静脉高压症: {},
            胆道疾病: {},
            胰腺疾病: {},
            脾疾病: {},
            消化道大出血的诊断与外科处理原则: {},
            急腹症的诊断与鉴别诊断: {},
            周围血管与淋巴管疾病: {},
            '泌尿、男生殖系统外科检查和诊断': {},
            '泌尿、男生殖系统先天性畸形': {},
            泌尿系统外伤: {},
            '泌尿、男生殖系统感染': {},
            '泌尿、男生殖系统结核': {},
            尿路梗阻: {},
            尿路结石: {},
            '泌尿、男生殖系统肿瘤': {},
            '泌尿、男生殖系统的其他疾病': {},
            肾上腺疾病的外科治疗: {},
            '男性性功能障碍、不育和节育': {},
            运动系统畸形: {},
            骨折概论: {},
            '上肢骨、关节损伤': {},
            '手外伤及断肢（指）再植': {},
            '下肢骨、关节损伤': {},
            '脊柱、脊髓损伤': {},
            '骨盆、髋臼骨折': {},
            周围神经损伤: {},
            运动系统慢性损伤: {},
            股骨头坏死: {},
            '颈、腰椎退行性疾病': {},
            骨与关节化脓性感染: {},
            骨与关节结核: {},
            化脓性关节炎: {},
            骨肿瘤: {},
        },
        内科学: { 呼吸系统: {} },
        妇科学: { 基础: {} },
        儿科学: { 儿子: {} },
        神经病学: { 周围神经疾病: {} },
    })

    return { chapter }
})

import { jsonrepair } from 'jsonrepair'
export const useCaseStore = defineStore('case', () => {
    //     const simCase = ref(`
    //   **姓名**：张晓红
    //   **性别**：女
    //   **年龄**：48岁
    //   **主诉**：发现右侧乳房肿块伴疼痛2周
    //   **现病史**：患者2周前无明显诱因下发现右侧乳房肿块，位于外上象限，约2cm×1.5cm大小，质韧，边界尚清，活动度可，伴有轻度疼痛，与月经周期无关。患者自诉近期精神压力大，睡眠质量下降。遂来就诊。
    //   **既往史**：既往体健，无特殊病史。
    //   **查体**：T 36.8℃，P 85次/分，R 18次/分，BP 110/75mmHg。心、肺、腹查体未见异常。右侧乳房外上象限可触及一肿块，约2cm×1.5cm大小，质韧，边界尚清，活动度可，局部皮肤无红肿，无卫星结节。左侧乳房外观正常。
    //   **专科查体**：右侧乳房肿块质地均匀，无触痛，与皮肤无粘连，同侧腋窝淋巴结未触及肿大。
    //   **辅助检查**：乳腺超声：右侧乳腺外上象限实质性肿块，建议活检。乳腺钼靶：右侧乳腺外上象限肿块，性质待定。
    //   **诊断**: 乳腺癌
    //   **治疗**: 乳腺癌系统综合治疗
    //   **手术**：行右侧乳腺癌改良根治术
    //   **病理**：ER(-)，PR(-)，HER-2(-)，Ki67 20%。
    //   `)
    const simCase = ref('')
    // const simCaseJson = ref({
    //     姓名: '张晓红',
    //     性别: '女',
    //     年龄: 48,
    //     主诉: '发现右侧乳房肿块伴疼痛2周',
    //     现病史: '患者2周前无明显诱因下发现右侧乳房肿块，位于外上象限，约2cm×1.5cm大小，质韧，边界尚清，活动度可，伴有轻度疼痛，与月经周期无关。患者自诉近期精神压力大，睡眠质量下降。遂来就诊。',
    //     既往史: '既往体健，无特殊病史。',
    //     查体: "体温: '36.8℃', 脉搏: '85次/分', 呼吸: '18次/分', 血压: '110/75mmHg', 心肺腹查体: '未见异常', 右侧乳房: '外上象限可触及一肿块，约2cm×1.5cm大小，质韧，边界尚清，活动度可，局部皮肤无红肿，无卫星结节', 左侧乳房: '外观正常'",
    //     专科查体: "右侧乳房肿块: '质地均匀，无触痛，与皮肤无粘连', 同侧腋窝淋巴结: '未触及肿大'",
    //     辅助检查:
    //         "乳腺超声: '右侧乳腺外上象限实质性肿块，建议活检', 乳腺钼靶: '右侧乳腺外上象限肿块，性质待定'",
    //     诊断: '右侧乳腺癌',
    //     治疗: '乳腺癌系统综合治疗',
    //     手术: '行右侧乳腺肿块切除术',
    //     病理: "ER: '-', PR: '-', 'HER-2': '-', Ki67: '20%'",
    // })

    const simCaseJson = ref('')

    function updateSimCaseJson(caseJson) {
        // console.log(caseJson)
        const fixedCaseJson = caseJson.includes('```json') ? caseJson.slice(7, -3) : caseJson
        // console.log(fixedCaseJson)
        const repairedCaseJson = jsonrepair(fixedCaseJson)
        simCaseJson.value = JSON.parse(repairedCaseJson)
    }

    function clearSimCaseJson() {
        simCaseJson.value = ''
    }
    return { simCase, simCaseJson, updateSimCaseJson, clearSimCaseJson }
})

import { jsonrepair } from 'jsonrepair'
export const useTestStore = defineStore('test', () => {
    const test = ref('')
    function fixTest() {
        console.log(test.value)
        const fixedTest = test.value.includes('```json') ? test.value.slice(7, -3) : test.value
        console.log(fixedTest)
        const repairedTest = jsonrepair(fixedTest)
        test.value = JSON.parse(repairedTest)
    }
    function clearTest() {
        test.value = ''
    }
    return { test, clearTest, fixTest }
})

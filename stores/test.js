export const useTestStore = defineStore('test', () => {
    const testFields = ['题目1', '题目2', '题目3']
    const test = ref('')
    function updateTest(newCase) {
        test.value = newCase
    }
    function clearTest() {
        test.value = ''
    }
    return { test, clearTest, updateTest, testFields }
})

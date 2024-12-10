export const useSimTestStore = defineStore('simtest', () => {
    const simTest = ref('')
    const simTestFields = ref(['题目1', '题目2', '题目3'])

    function updateSimTest(value) {
        simTest.value = value
    }

    function deleteSimTest() {
        simTest.value = ''
    }

    return { simTest, simTestFields, updateSimTest, deleteSimTest }
})

export const useModelStore = defineStore('model', () => {
    const models = ref({
        bigmodel: ['glm-4-flash'],
        xfyun: ['lite'],
        doubao: ['ep-20241223143555-ms9k5'],
    })

    return { models }
})

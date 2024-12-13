export const useModelStore = defineStore('model', () => {
    const platform = ref('bigmodel')
    const model = ref('glm-4-flash')

    const models = ref({
        bigmodel: ['glm-4-flash'],
    })

    return { platform, model, models }
})

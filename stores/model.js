export const useModelStore = defineStore('model', () => {
    const models = ref({
        bigmodel: ['glm-4-flash'],
        xfyun: ['lite'],
    })

    return { models }
})

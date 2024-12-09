export const useModelStore = defineStore(
    'model',
    () => {
        const model = ref('glm-4-flash')
        return { model }
    },
    {
        persist: true,
    }
)

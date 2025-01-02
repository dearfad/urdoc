export const useModelStore = defineStore('model', () => {
    const models = ref({
        // BigModel 智谱AI大模型开放平台 https://bigmodel.cn
        智谱: [{ name: '智谱 GLM-4-Flash', id: 'glm-4-flash' }],
        // 讯飞开放平台 星火大模型 https://www.xfyun.cn/
        // 讯飞: [{ name: '星火 Spark Lite', id: 'lite' }],
        // 火山方舟 豆包大模型 https://www.volcengine.com/product/ark
        // 火山方舟: [{ name: '豆包 Doubao-lite-4k|character-240828', id: 'ep-20241223143555-ms9k5' }],
        // 阿里云百炼 通义大模型 https://www.aliyun.com/product/bailian
        // 阿里云百炼: [{ name: '通义千问-Plus-2024-11-25', id: 'qwen-plus-2024-11-25' }],
    })

    return { models }
})

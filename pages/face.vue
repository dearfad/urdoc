<template>
    <v-container class="text-center">
        <v-row>
            <v-col cols="12">
                <CommonCaseNavCard />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <h1>头像生成</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-img width="320" min-height="320" class="mx-auto" :src="imgUrl">
                    <template #placeholder
                        ><div v-if="imgUrl" class="d-flex align-center justify-center fill-height">
                            <v-progress-circular color="grey-lighten-4" indeterminate /></div
                    ></template>
                </v-img>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-btn :loading="isLoading" @click="getFace">生成头像</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const imgUrl = ref('')
const isLoading = ref(false)
const simCaseStore = useSimCaseStore()

async function getFace() {
    isLoading.value = true
    const response = await $fetch('https://open.bigmodel.cn/api/paas/v4/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + import.meta.env.VITE_BIGMODEL_API_KEY,
        },
        body: {
            model: 'cogview-3-flash',
            prompt: `${simCaseStore.simCase.年龄}${simCaseStore.simCase.性别}性，中国人，半身近照，在医院门诊拍摄。`,
        },
    })
    if (!response) {
        return (stateStore.appInfo = '获取模型响应数据为空！')
    } else {
        if (response.data[0].url) {
            imgUrl.value = response.data[0].url
        }
    }
    isLoading.value = false
}
</script>

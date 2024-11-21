<template>
    <v-card class="text-center mx-auto pa-2" variant="flat">
        <v-card-item style="font-family: 方正舒体">
            <v-card-title class="text-h2 font-weight-bold text-blue">URDOC</v-card-title>
            <v-card-subtitle class="text-h4 font-weight-bold">虚拟病例研究所</v-card-subtitle>
        </v-card-item>
        <v-card-text class="text-h6">
            是通过大语言模型<span class="font-weight-bold"
                >生成病例、模拟问诊、背景创造、问题设计和问答评估</span
            >为一体的虚拟病例研究平台。
        </v-card-text>
        <v-card-actions>
            <v-btn
                class="mx-auto font-weight-bold text-red"
                prepend-icon="mdi-heart"
                append-icon="mdi-heart"
                size="x-large"
                @click="routeToGenCase"
                >开始</v-btn
            >
        </v-card-actions>
        <v-img max-width="300" class="mx-auto" src="/heroimage.jpg" />
    </v-card>
</template>

<script setup>
const router = useRouter()
function routeToGenCase() {
    router.push('/gencase')
}
</script>

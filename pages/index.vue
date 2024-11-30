<template>
    <v-card class="text-center mx-auto" variant="flat">
        <v-card-item>
            <v-card-title class="text-h2 font-weight-bold text-blue">URDOC</v-card-title>
            <v-card-subtitle class="text-h4 font-weight-bold">虚拟病例研究所</v-card-subtitle>
        </v-card-item>
        <v-card-text class="text-h6">
            是通过大语言模型<span class="font-weight-bold"
                >生成病例、编写故事、设计问题、模拟问诊和评估能力</span
            >为一体的虚拟病例研究平台。
        </v-card-text>
        <v-img max-width="250" class="mx-auto" src="/heroimage.jpg" />
        <v-card-actions>
            <v-btn class="mx-auto font-weight-bold" size="x-large" to="/guide"> 开始 </v-btn>
        </v-card-actions>
    </v-card>
</template>

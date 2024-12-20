<template>
    <v-sheet class="d-flex flex-column">
        <v-sheet class="text-h2 font-weight-bold text-blue text-center my-8">URDOC</v-sheet>
        <v-sheet class="text-h4 font-weight-bold text-center">虚拟病例研究所</v-sheet>
        <v-sheet>
            <v-img max-width="640" class="mx-auto" src="/heroimage.png" />
        </v-sheet>
        <v-sheet class="text-h6 text-center ma-2 pa-2"
            >是通过大语言模型<span class="font-weight-bold"
                >生成病例、编写故事、设计问题、模拟问诊和评估能力</span
            >为一体的虚拟病例研究平台。</v-sheet
        >
        <v-sheet class="text-center">
            <v-btn
                class="font-weight-bold px-16 mb-auto mt-4"
                size="x-large"
                to="/case"
                rounded="lg"
                variant="outlined"
            >
                开始研究
            </v-btn>
        </v-sheet>
    </v-sheet>
</template>

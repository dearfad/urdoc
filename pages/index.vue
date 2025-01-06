<template>
    <v-container fluid class="text-center">
        <v-row>
            <v-col cols="12">
                <span class="text-h2 font-weight-bold text-blue">URDOC</span>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <span class="text-h4 font-weight-bold">虚拟病例研究所</span>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-img max-width="640" min-height="200" class="mx-auto" src="/heroimage.png" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <span class="text-h6">
                    是通过大语言模型
                    <span class="font-weight-bold">
                        生成病例、编写故事、设计问题、模拟问诊和评估能力
                    </span>
                    为一体的虚拟病例研究平台。
                </span>
            </v-col>
        </v-row>
        <v-spacer />
        <v-row>
            <v-col cols="12">
                <v-btn
                    class="font-weight-bold my-4"
                    size="x-large"
                    to="/clinic"
                    rounded="lg"
                    variant="outlined"
                >
                    开始门诊
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

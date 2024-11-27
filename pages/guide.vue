<template>
    <v-stepper
        prev-text="上一步"
        next-text="下一步"
        :items="['生成病例', '编写故事', '设计问题', '模拟问诊', '评估能力']"
    >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.1>
            <v-card title="第一步：生成病例">通过大语言模型生成病例</v-card>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.2>
            <v-card title="第二步：编写故事">因为疾病给患者的生活带了影响</v-card>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.3>
            <v-card title="第三步：设计问题">获得患者资料后，生成相关问题</v-card>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.4>
            <v-card title="第四步：模拟问诊">模拟门诊问诊过程，获得患者资料</v-card>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.5>
            <v-card title="第五步：评估能力">模拟问答过程，了解诊疗能力</v-card>
        </template>
    </v-stepper>
</template>

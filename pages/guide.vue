<template>
    <v-timeline side="end">
        <v-timeline-item v-for="item in items" :key="item.id" dot-color="green" :icon="item.icon">
            <v-card :title="item.title" :subtitle="item.text" variant="flat" :to="item.link"
        /></v-timeline-item>
    </v-timeline>
</template>

<script setup>
const items = [
    {
        id: useId(),
        title: '第一步：生成病例',
        text: '通过大语言模型生成病例',
        icon: 'mdi-wrench-outline',
        link: '/case',
    },
    {
        id: useId(),
        title: '第二步：编写故事',
        text: '疾病对患者生活影响的故事',
        icon: 'mdi-book-open-outline',
        // link: '/story',
    },
    {
        id: useId(),
        title: '第三步：设计问题',
        text: '获得患者资料后生成相关的问题',
        icon: 'mdi-ab-testing',
        // link: '/test',
    },
    {
        id: useId(),
        title: '第四步：模拟问诊',
        text: '模拟门诊问诊过程以获得患者资料',
        icon: 'mdi-account-outline',
        // link: '/simpatient',
    },
    {
        id: useId(),
        title: '第五步：评估能力',
        text: '模拟问答过程进而了解诊疗能力',
        icon: 'mdi-shield-star-outline',
        // link: '/simask',
    },
]
</script>

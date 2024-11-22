<template>
    <v-stepper
        prev-text="上一步"
        next-text="下一步"
        :items="['生成病例', '模拟问诊', '编写故事', '设计问题', '评估能力']"
    >
        <template #item.1>
            <v-card title="Step 1">...</v-card>
        </template>

        <template #item.2>
            <v-card title="Step 2">...</v-card>
        </template>

        <template #item.3>
            <v-card title="Step 3">...</v-card>
        </template>
        <template #item.4>
            <v-card title="Step 4">...</v-card>
        </template>

        <template #item.5>
            <v-card title="Step 5">...</v-card>
        </template>
    </v-stepper>
</template>

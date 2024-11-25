<template>
    <!-- <v-sheet class="overflow-auto">
        <v-list>
            <v-list-item v-for="(value, key, index) in simCaseJson" :key="index">
                <span class="font-weight-bold">{{ key }}：</span>{{ value }}
            </v-list-item>
        </v-list>
    </v-sheet> -->
    <v-container>
        <v-row>
            <v-col
                ><v-text-field prefix="姓名：" variant="underlined" :model-value="simCaseJson.姓名"
            /></v-col>
            <v-col
                ><v-text-field prefix="姓名：" variant="underlined" :model-value="simCaseJson.姓名"
            /></v-col>
            <v-col
                ><v-text-field prefix="姓名：" variant="underlined" :model-value="simCaseJson.姓名"
            /></v-col>
        </v-row>
        <v-row>
            <v-col> <span class="font-weight-bold">姓名：</span>{{ simCaseJson.姓名 }} </v-col>
            <v-col> <span class="font-weight-bold">性别：</span>{{ simCaseJson.性别 }} </v-col>
            <v-col> <span class="font-weight-bold">年龄：</span>{{ simCaseJson.年龄 }} </v-col>
        </v-row>
        <v-row>
            <v-col> <span class="font-weight-bold">主诉：</span>{{ simCaseJson.主诉 }} </v-col>
        </v-row>
        <v-row>
            <v-col> <span class="font-weight-bold">现病史：</span>{{ simCaseJson.现病史 }} </v-col>
        </v-row>
        <v-row>
            <v-col> <span class="font-weight-bold">既往史：</span>{{ simCaseJson.既往史 }} </v-col>
        </v-row>
        <v-row>
            <v-col> <span class="font-weight-bold">查体：</span>{{ simCaseJson.查体 }} </v-col>
        </v-row>
        <v-row>
            <v-col>
                <span class="font-weight-bold">专科查体：</span>{{ simCaseJson.专科查体 }}
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <span class="font-weight-bold">辅助检查：</span>{{ simCaseJson.辅助检查 }}
            </v-col>
        </v-row>
        <v-row>
            <v-col> <span class="font-weight-bold">手术：</span>{{ simCaseJson.手术 }} </v-col>
        </v-row>
        <v-row>
            <v-col> <span class="font-weight-bold">病理：</span>{{ simCaseJson.病理 }} </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)
</script>

<template>
    <!-- <v-sheet class="overflow-auto">
        <v-list>
            <v-list-item v-for="(value, key, index) in simCaseJson" :key="index">
                <span class="font-weight-bold">{{ key }}：</span>{{ value }}
            </v-list-item>
        </v-list>
    </v-sheet> -->
    <v-form>
        <v-sheet class="ma-2 pa-2">
            <v-text-field
                v-model="simCaseJson.姓名"
                prefix="姓名："
                :variant="varTextField"
                hide-details="auto"
            />
            <v-text-field
                v-model="simCaseJson.性别"
                prefix="性别："
                :variant="varTextField"
                hide-details="auto"
            />
            <v-text-field
                v-model="simCaseJson.年龄"
                prefix="年龄："
                :variant="varTextField"
                hide-details="auto"
            />
            <v-text-field
                v-model="simCaseJson.主诉"
                prefix="主诉："
                :variant="varTextField"
                hide-details="auto"
            />
            <v-textarea
                v-model="simCaseJson.现病史"
                rows="1"
                auto-grow
                prefix="现病史："
                :variant="varTextField"
                hide-details="auto"
            />
            <v-textarea
                v-model="simCaseJson.既往史"
                rows="1"
                auto-grow
                prefix="既往史："
                :variant="varTextField"
                hide-details="auto"
            />
            <v-textarea
                v-model="simCaseJson.查体"
                rows="1"
                auto-grow
                prefix="查体："
                :variant="varTextField"
                hide-details="auto"
            />
            <v-textarea
                v-model="simCaseJson.专科查体"
                rows="1"
                auto-grow
                prefix="专科查体："
                :variant="varTextField"
                hide-details="auto"
            />
            <v-textarea
                v-model="simCaseJson.辅助检查"
                rows="1"
                auto-grow
                prefix="辅助检查："
                :variant="varTextField"
                hide-details="auto"
            />
            <v-textarea
                v-model="simCaseJson.诊断"
                rows="1"
                auto-grow
                prefix="诊断："
                :variant="varTextField"
                hide-details="auto"
            />
            <v-textarea
                v-model="simCaseJson.治疗"
                rows="1"
                auto-grow
                prefix="治疗："
                :variant="varTextField"
                hide-details="auto"
            />
            <v-textarea
                v-model="simCaseJson.手术"
                rows="1"
                auto-grow
                prefix="手术："
                :variant="varTextField"
                hide-details="auto"
            />
            <v-textarea
                v-model="simCaseJson.病理"
                rows="1"
                auto-grow
                prefix="病理："
                :variant="varTextField"
                hide-details="auto"
            />
        </v-sheet>
    </v-form>
</template>

<script setup>
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)

const varTextField = ref('outlined')
</script>

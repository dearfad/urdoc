<template>
    <v-sheet>
        <v-text-field
            v-model="simCaseJson.姓名"
            class="my-4"
            label="姓名"
            :variant="varTextField"
            hide-details="auto"
        />
        <v-text-field
            v-model="simCaseJson.性别"
            class="my-4"
            label="性别"
            :variant="varTextField"
            hide-details="auto"
        />
        <v-text-field
            v-model="simCaseJson.年龄"
            class="my-4"
            label="年龄"
            :variant="varTextField"
            hide-details="auto"
        />
        <v-text-field
            v-model="simCaseJson.主诉"
            label="主诉"
            :variant="varTextField"
            hide-details="auto"
        />
        <v-textarea
            v-model="simCaseJson.现病史"
            class="my-4"
            rows="1"
            auto-grow
            label="现病史"
            :variant="varTextField"
            hide-details="auto"
        />
        <v-textarea
            v-model="simCaseJson.既往史"
            class="my-4"
            rows="1"
            auto-grow
            label="既往史"
            :variant="varTextField"
            hide-details="auto"
        />
        <v-textarea
            v-model="simCaseJson.查体"
            class="my-4"
            rows="1"
            auto-grow
            label="查体："
            :variant="varTextField"
            hide-details="auto"
        />
        <v-textarea
            v-model="simCaseJson.专科查体"
            rows="1"
            class="my-4"
            auto-grow
            label="专科查体："
            :variant="varTextField"
            hide-details="auto"
        />
        <v-textarea
            v-model="simCaseJson.辅助检查"
            rows="1"
            class="my-4"
            auto-grow
            label="辅助检查："
            :variant="varTextField"
            hide-details="auto"
        />
        <v-textarea
            v-model="simCaseJson.诊断"
            class="my-4"
            rows="1"
            auto-grow
            label="诊断："
            :variant="varTextField"
            hide-details="auto"
        />
        <v-textarea
            v-model="simCaseJson.治疗"
            class="my-4"
            rows="1"
            auto-grow
            label="治疗："
            :variant="varTextField"
            hide-details="auto"
        />
        <v-textarea
            v-model="simCaseJson.手术"
            class="my-4"
            rows="1"
            auto-grow
            label="手术："
            :variant="varTextField"
            hide-details="auto"
        />
        <v-textarea
            v-model="simCaseJson.病理"
            class="my-4"
            rows="1"
            auto-grow
            label="病理："
            :variant="varTextField"
            hide-details="auto"
        />
    </v-sheet>
    <v-sheet class="my-2">
        <v-chip variant="text" class="px-1">标签:</v-chip>
        <v-chip v-if="selectedBook != '任意'" variant="outlined" class="ma-1">
            {{ selectedBook }}
        </v-chip>
        <v-chip v-if="selectedChapter != '任意'" variant="outlined" class="ma-1">
            {{ selectedChapter }}
        </v-chip>
        <v-chip v-if="selectedSection != '任意'" variant="outlined" class="ma-1">
            {{ selectedSection }}
        </v-chip>
        <v-chip v-if="selectedSubsection != '任意'" variant="outlined" class="ma-1">
            {{ selectedSubsection }}
        </v-chip>
        <v-chip v-if="genCaseKeyPoint != ''" variant="outlined" class="ma-1">
            {{ genCaseKeyPoint }}
        </v-chip>
    </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)
const stateStore = useStateStore()
const { selectedBook, selectedChapter, selectedSection, selectedSubsection, genCaseKeyPoint } =
    storeToRefs(stateStore)
const varTextField = ref('outlined')
</script>

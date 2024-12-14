<template>
    <v-sheet>
        <v-sheet>
            <v-tabs v-model="tab">
                <v-tab value="1">原始数据</v-tab>
                <v-tab value="2">文本格式</v-tab>
                <v-tab value="3">JSON格式</v-tab>
                <v-tab value="4">MARKDOWN格式</v-tab>
            </v-tabs>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="1">
                    <v-textarea
                        v-model="modelResponseString"
                        class="my-4"
                        rows="1"
                        auto-grow
                        :variant="varTextField"
                        hide-details="auto"
                    />
                </v-tabs-window-item>
                <v-tabs-window-item value="2">
                    <v-textarea v-model="simCaseText" :variant="varTextField" rows="1" auto-grow />
                </v-tabs-window-item>
                <v-tabs-window-item value="3">
                    <v-text-field
                        v-model="simCase.姓名"
                        class="my-4"
                        label="姓名"
                        :variant="varTextField"
                        hide-details="auto"
                    />
                    <v-text-field
                        v-model="simCase.性别"
                        class="my-4"
                        label="性别"
                        :variant="varTextField"
                        hide-details="auto"
                    />
                    <v-text-field
                        v-model="simCase.年龄"
                        class="my-4"
                        label="年龄"
                        :variant="varTextField"
                        hide-details="auto"
                    />
                    <v-text-field
                        v-model="simCase.主诉"
                        label="主诉"
                        :variant="varTextField"
                        hide-details="auto"
                    />
                    <v-textarea
                        v-model="simCase.现病史"
                        class="my-4"
                        rows="1"
                        auto-grow
                        label="现病史"
                        :variant="varTextField"
                        hide-details="auto"
                    />
                    <v-textarea
                        v-model="simCase.既往史"
                        class="my-4"
                        rows="1"
                        auto-grow
                        label="既往史"
                        :variant="varTextField"
                        hide-details="auto"
                    />
                    <v-textarea
                        v-model="simCase.查体"
                        class="my-4"
                        rows="1"
                        auto-grow
                        label="查体："
                        :variant="varTextField"
                        hide-details="auto"
                    />
                    <v-textarea
                        v-model="simCase.专科查体"
                        rows="1"
                        class="my-4"
                        auto-grow
                        label="专科查体："
                        :variant="varTextField"
                        hide-details="auto"
                    />
                    <v-textarea
                        v-model="simCase.辅助检查"
                        rows="1"
                        class="my-4"
                        auto-grow
                        label="辅助检查："
                        :variant="varTextField"
                        hide-details="auto"
                    />
                    <v-textarea
                        v-model="simCase.诊断"
                        class="my-4"
                        rows="1"
                        auto-grow
                        label="诊断："
                        :variant="varTextField"
                        hide-details="auto"
                    />
                    <v-textarea
                        v-model="simCase.治疗"
                        class="my-4"
                        rows="1"
                        auto-grow
                        label="治疗："
                        :variant="varTextField"
                        hide-details="auto"
                    />
                    <v-textarea
                        v-model="simCase.手术"
                        class="my-4"
                        rows="1"
                        auto-grow
                        label="手术："
                        :variant="varTextField"
                        hide-details="auto"
                    />
                    <v-textarea
                        v-model="simCase.病理"
                        class="my-4"
                        rows="1"
                        auto-grow
                        label="病理："
                        :variant="varTextField"
                        hide-details="auto"
                    />
                </v-tabs-window-item>
                <v-tabs-window-item value="4">
                    <v-textarea
                        v-model="simCaseMarkdown"
                        :variant="varTextField"
                        rows="1"
                        auto-grow
                    />
                </v-tabs-window-item>
            </v-tabs-window>
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
            <span v-if="genCaseKeyPoint != ''">
                <v-chip
                    v-for="keyPoint in genCaseKeyPoint.split(' ')"
                    :key="keyPoint"
                    variant="outlined"
                    class="ma-1"
                >
                    {{ keyPoint }}
                </v-chip>
            </span>
        </v-sheet>
    </v-sheet>
</template>

<script setup lang="ts">
const simCaseStore = useSimCaseStore()
const { simCase, simCaseText, simCaseMarkdown } = storeToRefs(simCaseStore)
const stateStore = useStateStore()
const {
    selectedBook,
    selectedChapter,
    selectedSection,
    selectedSubsection,
    genCaseKeyPoint,
    modelResponseString,
} = storeToRefs(stateStore)
const varTextField = ref('outlined')
const tab = ref()
</script>

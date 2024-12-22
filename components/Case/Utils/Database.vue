<template>
    <v-sheet class="d-flex flex-column">
        <v-btn text="保存" size="x-large" block class="font-weight-bold my-4" @click="saveCase" />
        <v-btn text="删除" size="x-large" block class="font-weight-bold my-4" @click="deleteCase" />
    </v-sheet>
</template>

<script setup>
const simCaseStore = useSimCaseStore()
const modelStore = useModelStore()
const stateStore = useStateStore()
const supabase = useSupabaseClient()

async function saveCase() {
    if (stateStore.id) {
        const { data, error } = await supabase
            .from('simcases')
            .update([
                {
                    book: stateStore.selectedBook,
                    chapter: stateStore.selectedChapter,
                    section: stateStore.selectedSection,
                    subsection: stateStore.selectedSubsection,
                    casetag: stateStore.caseTag,
                    content: simCaseStore.simCase,
                    platform: modelStore.platform,
                    model: modelStore.model,
                    public: true,
                },
            ])
            .eq('id', stateStore.id)
            .select()
        if (data != null && data.length > 0) {
            stateStore.updateAppInfo('更新记录成功！')
        } else {
            switch (error.code) {
                case '42501':
                    stateStore.updateAppInfo('用户未登录，请登录后保存！')
                    break
                default:
                    stateStore.updateAppInfo(error)
                    break
            }
        }
    } else {
        const { data, error } = await supabase
            .from('simcases')
            .insert([
                {
                    book: stateStore.selectedBook,
                    chapter: stateStore.selectedChapter,
                    section: stateStore.selectedSection,
                    subsection: stateStore.selectedSubsection,
                    casetag: stateStore.caseTag,
                    content: simCaseStore.simCase,
                    platform: stateStore.selectedPlatform,
                    model: stateStore.selectedModel,
                    public: true,
                },
            ])
            .select()
        if (data != null && data.length > 0) {
            stateStore.id = data[0].id
            stateStore.updateAppInfo('添加记录成功！')
        } else {
            switch (error.code) {
                case '42501':
                    stateStore.updateAppInfo('用户未登录，请登录后保存！')
                    break
                default:
                    stateStore.updateAppInfo(error)
                    break
            }
        }
    }
}

async function deleteCase() {
    if (stateStore.id) {
        const { data, error } = await supabase
            .from('simcases')
            .delete()
            .eq('id', stateStore.id)
            .select()
        if (data.length > 0) {
            stateStore.updateAppInfo('删除成功！')
            stateStore.id = null
        } else {
            stateStore.updateAppInfo('没找到记录！')
        }
        if (error) {
            stateStore.updateAppInfo(error)
        }
    } else {
        stateStore.updateAppInfo('当前记录未在数据库中！')
    }
}
</script>

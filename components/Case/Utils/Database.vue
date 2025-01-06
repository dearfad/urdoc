<template>
    <v-sheet class="d-flex flex-column">
        <v-btn text="保存" size="x-large" block class="font-weight-bold my-4" @click="saveCase" />
        <v-btn text="删除" size="x-large" block class="font-weight-bold my-4" @click="deleteCase" />
    </v-sheet>
</template>

<script setup>
const caseStore = useCaseStore()
const stateStore = useStateStore()
const supabase = useSupabaseClient()

async function saveCase() {
    if (stateStore.id) {
        const { data, error } = await supabase
            .from('cases')
            .update([
                {
                    book: stateStore.selectedBook,
                    chapter: stateStore.selectedChapter,
                    section: stateStore.selectedSection,
                    subsection: stateStore.selectedSubsection,
                    casetag: stateStore.caseTag,
                    content: caseStore.caseContent,
                    platform: stateStore.selectedPlatform,
                    model_name: stateStore.selectedModel.name,
                    model_id: stateStore.selectedModel.id,
                    public: true,
                },
            ])
            .eq('id', stateStore.id)
            .select()
        if (data != null && data.length > 0) {
            stateStore.appInfo = '更新记录成功！'
        } else {
            switch (error.code) {
                case '42501':
                    stateStore.appInfo = '用户未登录，请登录后保存！'
                    break
                default:
                    stateStore.appInfo = error
                    break
            }
        }
    } else {
        const { data, error } = await supabase
            .from('cases')
            .insert([
                {
                    book: stateStore.selectedBook,
                    chapter: stateStore.selectedChapter,
                    section: stateStore.selectedSection,
                    subsection: stateStore.selectedSubsection,
                    casetag: stateStore.caseTag,
                    content: caseStore.caseContent,
                    platform: stateStore.selectedPlatform,
                    model_name: stateStore.selectedModel.name,
                    model_id: stateStore.selectedModel.id,
                    public: true,
                },
            ])
            .select()
        if (data != null && data.length > 0) {
            stateStore.id = data[0].id
            stateStore.appInfo = '添加记录成功！'
        } else {
            switch (error.code) {
                case '42501':
                    stateStore.appInfo = '用户未登录，请登录后保存！'
                    break
                default:
                    stateStore.appInfo = error
                    break
            }
        }
    }
}

async function deleteCase() {
    if (stateStore.id) {
        const { data, error } = await supabase
            .from('cases')
            .delete()
            .eq('id', stateStore.id)
            .select()
        if (data.length > 0) {
            stateStore.appInfo = '删除成功！'
            stateStore.id = null
        } else {
            stateStore.appInfo = '没找到记录！'
        }
        if (error) {
            stateStore.appInfo = error
        }
    } else {
        stateStore.appInfo = '当前记录未在数据库中！'
    }
}
</script>

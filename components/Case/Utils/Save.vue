<template>
    <v-btn text="保存" @click="save" />
</template>

<script setup>
const simCaseStore = useSimCaseStore()
const modelStore = useModelStore()
const stateStore = useStateStore()

const supabase = useSupabaseClient()

async function save() {
    const { error } = await supabase.from('simcases').insert([
        {
            book: stateStore.selectedBook,
            chapter: stateStore.selectedChapter,
            section: stateStore.selectedSection,
            subsection: stateStore.selectedSubsection,
            keypoint: stateStore.genCaseKeyPoint,
            content: simCaseStore.simCase,
            platform: modelStore.platform,
            model: modelStore.model,
            public: true,
        },
    ])
    if (error) console.log(error)
}
</script>

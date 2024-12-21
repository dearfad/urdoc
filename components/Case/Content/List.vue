<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-data-table
                    v-model="selected"
                    :headers="headers"
                    :items="items"
                    show-select
                    select-strategy="single"
                    items-per-page-text="每页显示数量"
                    hide-no-data
                />
            </v-col>
        </v-row>
        <v-row class="justify-center">
            <v-col cols="6">
                <v-btn
                    block
                    size="x-large"
                    class="font-weight-bold"
                    text="读取病例"
                    :loading="isLoading"
                    @click="loadCase"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const supabase = useSupabaseClient()
const items = ref([])
const isLoading = ref(false)
const headers = ref([
    { title: '索引', key: 'id' },
    { title: '书', key: 'book' },
    { title: '章', key: 'chapter' },
    { title: '节', key: 'section' },
    { title: '小节', key: 'subsection' },
    { title: '标签', key: 'casetag' },
    { title: '主诉', key: 'content.主诉' },
])
const selected = ref()
watch(selected, () => {
    console.log(selected.value)
})

async function loadCase() {
    isLoading.value = true
    const { data, error } = await supabase
        .from('simcases')
        .select('id, book, chapter, section, subsection, casetag, content')
        .order('id')
    if (error) {
        console.log(error)
    }
    items.value = data
    isLoading.value = false
}
</script>

<style></style>

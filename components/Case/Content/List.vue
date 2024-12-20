<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-data-table :items="items" />
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
async function loadCase() {
    isLoading.value = true
    const { data, error } = await supabase.from('simcases').select('*')
    if (error) {
        console.log(error)
    }
    items.value = data
    isLoading.value = false
}
</script>

<style></style>

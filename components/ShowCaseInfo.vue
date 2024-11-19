<template>
    <v-card
        :title="simCaseJson['姓名']"
        :subtitle="simCaseJson['主诉']"
        :loading="isLoading"
        color="blue-lighten-5"
        class="flex-shrink-0"
    >
        <template #prepend>
            <v-avatar color="blue-darken-2">
                <v-icon icon="mdi-human-female" />
            </v-avatar>
        </template>
        <v-card-actions>
            <v-btn prepend-icon="mdi-account" @click="showInfo">信息</v-btn>
            <v-btn prepend-icon="mdi-wechat" @click="startChatting">问诊</v-btn>
            <v-spacer />
            <v-btn prepend-icon="mdi-logout" @click="genCase">下一位</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)
const isLoading = ref(false)
const stateStore = useStateStore()
const { currentContent } = storeToRefs(stateStore)

function startChatting() {
    currentContent.value = 'chat'
}

function showInfo() {
    currentContent.value = 'info'
}

function genCase() {
    currentContent.value = 'generate'
}
</script>

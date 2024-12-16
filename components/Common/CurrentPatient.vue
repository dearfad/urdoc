<template>
    <ClientOnly>
        <v-card
            v-if="simCaseStore.simCase"
            :title="simCaseStore.simCase.姓名"
            :subtitle="simCaseStore.simCase.主诉"
            prepend-icon="mdi-human-female"
        >
            <v-tabs v-model="tab" grow>
                <v-tab value="1" text="病历" />
                <v-tab value="2" text="故事" />
                <v-tab value="3" text="问题" />
            </v-tabs>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="1">
                    <v-sheet class="pa-4 text-body-1">
                        <MDC :value="simCaseStore.simCaseMarkdown" />
                    </v-sheet>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card>
    </ClientOnly>
</template>

<script setup lang="ts">
const simCaseStore = useSimCaseStore()
// const simStoryStore = useSimStoryStore()
// const simTestStore = useSimTestStore()
// const router = useRouter()
const tab = ref('1')
</script>

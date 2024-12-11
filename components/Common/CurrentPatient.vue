<template>
    <v-card
        v-if="simCaseStore.simCase"
        :title="simCaseStore.simCase.姓名"
        :subtitle="simCaseStore.simCase.主诉"
        prepend-icon="mdi-human-female"
    >
        <v-timeline direction="horizontal" side="end" density="compact">
            <v-timeline-item
                icon="mdi-wrench-outline"
                class="cursor-pointer"
                :dot-color="simCaseStore.simCase ? 'green' : 'grey'"
                @click="router.push('/gencase')"
            />
            <v-timeline-item
                icon="mdi-book-open-outline"
                class="cursor-pointer"
                :dot-color="simStoryStore.simStory ? 'green' : 'grey'"
                @click="router.push('/genstory')"
            />
            <v-timeline-item
                icon="mdi-ab-testing"
                class="cursor-pointer"
                :dot-color="simTestStore.simTest ? 'green' : 'grey'"
                @click="router.push('/gentest')"
            />
            <v-timeline-item
                icon="mdi-account-outline"
                class="cursor-pointer"
                dot-color="grey"
                @click="router.push('/simpatient')"
            />
            <v-timeline-item
                icon="mdi-shield-star-outline"
                class="cursor-pointer"
                dot-color="grey"
                @click="router.push('/simask')"
            />
        </v-timeline>
    </v-card>
</template>

<script setup lang="ts">
const simCaseStore = useSimCaseStore()
const simStoryStore = useSimStoryStore()
const simTestStore = useSimTestStore()
const router = useRouter()
</script>

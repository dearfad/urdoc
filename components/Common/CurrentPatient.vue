<template>
    <v-card
        v-if="simCaseJson"
        :title="simCaseJson['姓名']"
        :subtitle="simCaseJson['主诉']"
        prepend-icon="mdi-human-female"
    >
        <v-timeline direction="horizontal" side="end" density="compact">
            <v-timeline-item
                icon="mdi-wrench-outline"
                class="cursor-pointer"
                :dot-color="simCaseJson ? 'green' : 'grey'"
                @click="router.push('/gencase')"
            />
            <v-timeline-item
                icon="mdi-book-open-outline"
                class="cursor-pointer"
                :dot-color="story ? 'green' : 'grey'"
                @click="router.push('/genstory')"
            />
            <v-timeline-item
                icon="mdi-ab-testing"
                class="cursor-pointer"
                :dot-color="test ? 'green' : 'grey'"
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

<script setup>
const caseStore = useCaseStore()
const { simCaseJson } = storeToRefs(caseStore)
const storyStore = useStoryStore()
const { story } = storeToRefs(storyStore)
const testStore = useTestStore()
const { test } = storeToRefs(testStore)
const router = useRouter()
</script>

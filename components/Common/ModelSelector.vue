<template>
    <v-sheet>
        <v-select
            v-model="selectedPlatform"
            label="平台"
            :items="platforms"
            variant="outlined"
            class="my-4"
            hide-details="auto"
            clearable
            @update:model-value="handlePlatformChange"
        />
        <v-select
            v-model="selectedModel"
            label="模型"
            :items="models"
            item-title="name"
            item-value="id"
            variant="outlined"
            class="my-4"
            hide-details="auto"
            clearable
            return-object
        />
    </v-sheet>
</template>

<script setup>
const modelStore = useModelStore()
const stateStore = useStateStore()
const { selectedPlatform, selectedModel } = storeToRefs(stateStore)

const platforms = computed(() => {
    return [...Object.keys(modelStore.models)]
})

const models = computed(() => {
    return modelStore.models[selectedPlatform.value] || []
})

function handlePlatformChange() {
    selectedModel.value = models.value[0]
}
</script>

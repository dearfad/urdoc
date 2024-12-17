<template>
    <v-sheet class="mx-2">
        <v-tabs v-model="tab">
            <v-tab value="create" text="生成" />
            <v-tab value="read" text="读取" />
            <v-tab value="update" text="更新" />
            <v-tab value="delete" text="删除" />
        </v-tabs>
        <v-tabs-window v-model="tab" class="flex-grow-1">
            <v-tabs-window-item value="create">
                <CaseUtilsCreate />
            </v-tabs-window-item>
            <v-tabs-window-item value="read"> read </v-tabs-window-item>
            <v-tabs-window-item value="update">
                <CaseUtilsUpdate />
            </v-tabs-window-item>
            <v-tabs-window-item value="delete"> delete </v-tabs-window-item>
        </v-tabs-window>
    </v-sheet>
</template>

<script setup>
const tab = ref('')
</script>

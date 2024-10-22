<template>
    <!-- test fastapi -->
    <v-container>
        <v-row justify="center">
            <v-btn prepend-icon="$vuetify" stacked @click="getMessage">读取模型</v-btn>
        </v-row>
        <v-row justify="center">
            <v-card title="Test Axios" subtitle="Backend FastAPI">
                <v-card-text>{{ message }}</v-card-text>
            </v-card>
        </v-row>
    </v-container>
</template>

<script setup>
// test fastapi
import axios from "axios"
const message = ref("default")
function getMessage() {
    console.log(message.value)
    axios.get("/").then((res) => {
        message.value = res.data
    })
}
</script>

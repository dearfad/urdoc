<template>
    <!-- test fastapi -->
    <v-btn class="mx-auto" width="100px" height="100px" prepend-icon="$vuetify" stacked @click="getMessage">读取模型</v-btn>
    <v-card class="mx-auto my-8" elevation="16" width="250px" height="250px" title="Test Axios" subtitle="Backend FastAPI" :text="message.message"></v-card>
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

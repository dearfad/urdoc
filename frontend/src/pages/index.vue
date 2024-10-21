<template>
  <!-- <HelloWorld /> -->
  <!-- test fastapi -->
  <v-btn prepend-icon="$vuetify" stacked @click="getMessage">读取模型</v-btn>
  <v-card>{{ message }}</v-card>
</template>

<script setup>
// test fastapi
import axios from "axios"
const message = ref("default")
function getMessage() {
  axios.get("/").then((res) => {
    message.value = res.data
  })
}
</script>

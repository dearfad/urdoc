<template>
  <!-- test fastapi -->
  <button @click="getMessage">Get Message</button>
  <div>{{ message }}</div>

  <!-- <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app> -->
</template>

<script setup>
// test fastapi
import axios from "axios";
const message = ref("default");
function getMessage() {
  axios.get("/").then((res) => {
    message.value = res.data;
  });
}
</script>

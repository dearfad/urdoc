<template>
  <v-container>
    <v-row>
      <v-col>
        <ClientOnly>
          <vue-json-pretty :data="userStore.user" />
        </ClientOnly>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
const userStore = useUserStore()
</script>

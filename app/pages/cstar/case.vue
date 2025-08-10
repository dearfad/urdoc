<template>
  <v-container class="w-100 w-md-75">
    <v-row>
      <v-col>
        <CommonRecordTools />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <CaseContentShow />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <CaseUtilsCheck />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <CaseUtilsGenerate />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  title: '生成病例',
  layout: 'cstar',
})
</script>

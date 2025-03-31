<template>
  <v-sheet class="d-flex flex-column mx-4">
    <div class="ma-4 font-weight-bold">当前模型</div>
    <div class="ma-4 font-weight-bold">
      <vue-json-pretty :data="stateStore.models" class="mx-auto" />
    </div>
    <div class="ma-4 font-weight-bold">对话模型</div>
    <CommonModelSelector models-type="chatModels" />
    <div class="ma-4 font-weight-bold">文生图模型</div>
    <CommonModelSelector models-type="ttiModels" />
    <div class="ma-4 font-weight-bold">图生视频模型</div>
    <CommonModelSelector models-type="itvModels" />
  </v-sheet>
</template>

<script setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
const stateStore = useStateStore()
</script>

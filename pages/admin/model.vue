<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto mb-16">
    <div class="ma-4 font-weight-bold">当前模型</div>
    <div class="ma-4 font-weight-bold">
      <vue-json-pretty :data="stateStore.models" class="mx-auto" />
    </div>
    <div class="ma-4 font-weight-bold">对话模型 - 病例</div>
    <CommonModelSelector model-type="chat" model-usage="case" />
    <div class="ma-4 font-weight-bold">对话模型 - 故事</div>
    <CommonModelSelector model-type="chat" model-usage="story" />
    <div class="ma-4 font-weight-bold">对话模型 - 测试</div>
    <CommonModelSelector model-type="chat" model-usage="test" />
    <div class="ma-4 font-weight-bold">对话模型 - 问诊</div>
    <CommonModelSelector model-type="chat" model-usage="act" />
    <div class="ma-4 font-weight-bold">对话模型 - 评价</div>
    <CommonModelSelector model-type="chat" model-usage="rate" />
    <div class="ma-4 font-weight-bold">文生图模型 - 头像</div>
    <CommonModelSelector model-type="textToImage" model-usage="face" />
    <div class="ma-4 font-weight-bold">图生视频模型 - 动作</div>
    <CommonModelSelector model-type="imageToVideo" model-usage="pose" />
  </v-sheet>
</template>

<script setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
const stateStore = useStateStore()
</script>

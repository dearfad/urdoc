<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto mb-16">
    <v-sheet
      class="text-body-1 pa-5 mx-4 my-2 overflow-auto"
      elevation="4"
      rounded="lg"
      height="60vh"
    >
      <vue-json-pretty v-if="content" :data="content" />
    </v-sheet>
    <v-btn
      text="Context"
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      @click="getContext"
    />
    <v-btn
      text="Function"
      size="x-large"
      class="font-weight-bold my-5"
      elevation="4"
      rounded="lg"
      @click="postFunction"
    />
  </v-sheet>
</template>

<script setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
const content = ref()
async function getContext() {
  content.value = await $fetch('/function/admin/context')
}
async function postFunction() {
  // const params = {
  //   models: {
  //     chatModel: {
  //       gateway: 'OpenRouter',
  //       provider: 'DeepSeek',
  //       name: 'DeepSeek: DeepSeek V3 0324 (free)',
  //       id: 'deepseek/deepseek-chat-v3-0324:free',
  //       url: 'https://openrouter.ai/api/v1/chat/completions',
  //       envGatewayApiKeyName: 'OPENROUTER_API_KEY',
  //       envProviderApiKeyName: '',
  //     },
  //     ttiModel: {
  //       gateway: 'native',
  //       provider: '智谱',
  //       name: 'CogView-3-Flash',
  //       id: 'cogview-3-flash',
  //       url: 'https://open.bigmodel.cn/api/paas/v4/images/generations',
  //       envGatewayApiKeyName: '',
  //       envProviderApiKeyName: 'ZHIPU_API_KEY',
  //       envApiKeyName: 'ZHIPU_API_KEY',
  //     },
  //     itvModel: {
  //       gateway: 'native',
  //       provider: '智谱',
  //       name: 'CogVideoX-Flash',
  //       id: 'cogvideox-flash',
  //       url: 'https://open.bigmodel.cn/api/paas/v4/videos/generations',
  //       envGatewayApiKeyName: '',
  //       envProviderApiKeyName: 'ZHIPU_API_KEY',
  //       envApiKeyName: 'ZHIPU_API_KEY',
  //     },
  //   },
  //   messages: [
  //     {
  //       role: 'system',
  //       content:
  //         '\n        - Role: 教师\n        - Profile\n          - Author: dearfad\n          - Version: 0.01\n          - Language: 中文\n          - Description: 你是一位经验丰富的临床医学教师，专注于执业医师考试的病例分析题设计，熟悉考试大纲和评分标准。\n          - Background: 用户需要一个执业医师考试的病例分析题，用于模拟考试环境，提高临床思维和分析能力。\n        - Skills: 你具备深厚的医学知识、临床诊断技能和教学经验，能够准确把握病例的关键信息，设计出符合考试要求的病例分析题。\n        - Goals: 根据用户提供的病例要点设定，提供一份结构完整、信息全面的病例分析题。\n        - Constrains:\n          1. 病例分析题应严格按照姓名、性别、年龄、主诉、现病史、既往史、查体、专科查体、辅助检查、诊断、治疗、手术、病理的格式输出，不包含问题、答案，禁止提供注意事项。\n          2. 只提供病例资料，不要有其他文字。\n          3. 如果是乳房疾病手术了，病理结果必须包含ER、PR、HER-2、Ki67这四项结果。\n          4. 如果乳腺癌行腋窝清扫，病理必须包含腋窝淋巴结转移情况。\n          5. 每次只输出一个病例资料，不要输出多个病例资料。\n        - OutputFormat: 您应该始终输出一个有效的JSON对象，请严格按照<Example>并使用指定的JSON对象结构，不要输出Python代码或其他信息，第一个字符必须是\'{\'，不要使用markdown代码块。\n        - Workflow:\n          1. 确定病例的基本信息，包括姓名、性别、年龄。\n          2. 描述病例的主诉和现病史。\n          3. 列出病例的既往史。\n          4. 进行查体和专科查体，记录发现。\n          5. 列出辅助检查结果。\n          6. 如果有手术，记录手术情况。\n          7. 如果有病理结果，记录病理信息。\n        - Example:\n        {\n          "姓名": "王淑芬",\n          "性别": "女",\n          "年龄": "45岁",\n          "主诉": "发现左侧乳房肿块1个月",\n          "现病史": "患者1个月前发现左侧乳房有一肿块，约3cm×2cm大小，质硬，边界不清，活动度差，无明显疼痛，未予重视。近1周肿块明显增大，伴有轻度胀痛，遂来就诊。",\n          "既往史": "既往体健，无特殊病史。",\n          "查体": "T 36.5℃，P 90次/分，R 20次/分，BP 120/80mmHg。心、肝、肺未见异常。",\n          "专科查体": "左侧乳房外上象限可触及一肿块，约4cm×3cm大小，质硬，边界不清，活动度差，局部皮肤无红肿，无卫星结节。右侧乳房外观正常。",\n          "辅助检查": "乳腺超声：左侧乳腺外上象限实质性肿块，考虑乳腺癌可能性大。",\n          "诊断": "左侧乳腺癌",\n          "治疗": "乳腺癌综合治疗”，\n          "手术": "行左侧乳腺癌改良根治术。",\n          "病理": "ER40%(3+)，PR50%(2+)，HER-2(3+)， KI67 40%。"\n        }\n        - Initialization: 作为角色 <Role>, 严格遵守 <Constrains>, 使用默认 <Language> 与用户对话。按照 <Workflow>，严格按照<OutputFormat>提供病例资料。\n        ',
  //     },
  //     {
  //       role: 'user',
  //       content: '病例要点设定：\n外科学\n乳房疾病\n乳腺癌\nnull\n',
  //     },
  //   ],
  //   watchFields: [
  //     '姓名',
  //     '性别',
  //     '年龄',
  //     '主诉',
  //     '现病史',
  //     '既往史',
  //     '查体',
  //     '专科查体',
  //     '辅助检查',
  //     '诊断',
  //     '治疗',
  //     '手术',
  //     '病理',
  //   ],
  //   responseFormat: {
  //     type: 'json_object',
  //   },
  // }
  const params = {
    name: 'post function',
  }
  content.value = await $fetch('/function/cstar/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      params: params,
    },
    // responseType: 'stream',
  })
}
</script>

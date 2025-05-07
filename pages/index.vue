<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto justify-center align-center pt-4 ga-4">
    <div class="text-h2 font-weight-bold text-blue">URDOC</div>
    <div class="text-h4 font-weight-bold">虚拟病例研究平台</div>
    <div class="d-flex w-100 justify-center">
      <v-img max-width="640" src="/heroimage.png" />
    </div>
    <div class="text-h6 text-center px-4">
      <p>通过大语言模型</p>
      <p class="font-weight-bold">生成病例 编写故事 设计问题</p>
      <p class="font-weight-bold">模拟问诊 评估能力</p>
      <p>CSTAR模式的应用与创新实践</p>
    </div>
    <v-btn
      class="font-weight-bold my-8"
      size="x-large"
      to="/cstar/case"
      rounded="lg"
      variant="outlined"
    >
      创建病例
    </v-btn>
  </v-sheet>
</template>

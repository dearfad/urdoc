<template>
  <v-sheet class="d-flex flex-column w-100 w-md-75 mx-auto align-center pt-2 ga-4">
    <div class="text-h3 font-weight-bold text-blue">URDOC</div>
    <div class="text-h3 font-weight-bold">虚拟病例研究平台</div>
    <v-img min-width="640" src="/heroimage.png" class="mx-auto" />
    <div class="text-h6 text-center">
      是通过大语言模型
      <span class="font-weight-bold"> 生成病例、编写故事、设计问题、模拟问诊和评估能力 </span>
      为一体的虚拟病例研究平台
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

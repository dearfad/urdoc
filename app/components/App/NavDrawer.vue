<template>
  <ClientOnly>
    <v-navigation-drawer v-model="stateStore.isNavDrawerShow" location="left">
      <v-list nav>
        <v-list-subheader class="font-weight-bold">项目研究</v-list-subheader>
        <v-list-item prepend-icon="mdi-account-injury" to="/project/clinic">
          <v-list-item-title class="text-subtitle-2">虚拟门诊</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list nav>
        <v-list-subheader class="font-weight-bold">单项研究</v-list-subheader>
        <v-list-item v-for="(item, i) in items" :key="i" :value="item" :to="item.link">
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>
          <v-list-item-title class="text-subtitle-2">{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <template #append>
        <v-list-item class="mx-2 my-4" prepend-icon="mdi-cog-outline" to="/site/settings"
          ><v-list-item-title class="font-weight-bold text-subtitle-1"> 设置 </v-list-item-title>
        </v-list-item>
      </template>
    </v-navigation-drawer>
  </ClientOnly>
</template>

<script setup>
const stateStore = useStateStore()
const items = [
  { text: '生成病例', icon: 'mdi-alpha-c-circle', link: '/cstar/case' },
  { text: '编写故事', icon: 'mdi-alpha-s-circle', link: '/cstar/story' },
  { text: '设计问题', icon: 'mdi-alpha-t-circle', link: '/cstar/test' },
  { text: '模拟问诊', icon: 'mdi-alpha-a-circle', link: '/cstar/act' },
  { text: '评估能力', icon: 'mdi-alpha-r-circle', link: '/cstar/rate' },
  { text: '图像生成', icon: 'mdi-image-outline', link: '/image/face' },
  { text: '视频生成', icon: 'mdi-video-outline', link: '/video/pose' },
  { text: '语音合成', icon: 'mdi-account-tie-voice-outline', link: '/audio/voice' },
]
</script>

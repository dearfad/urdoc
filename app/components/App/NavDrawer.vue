<template>
  <ClientOnly>
    <v-navigation-drawer v-model="stateStore.isNavDrawerShow" location="left">
      <v-list nav>
        <v-list-subheader class="font-weight-bold">项目研究</v-list-subheader>
        <v-list-item prepend-icon="mdi-book-open-outline" to="/project/narrative-medicine">
          <v-list-item-title class="text-subtitle-1">{{
            $t('app.drawer.narrative-medicine')
          }}</v-list-item-title>
        </v-list-item>
        <v-list-item disabled prepend-icon="mdi-account-injury" to="/project/clinic">
          <v-list-item-title class="text-subtitle-1">虚拟门诊</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list nav>
        <v-list-subheader class="font-weight-bold">单项研究</v-list-subheader>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          :to="item.link"
          :disabled="item.disabled"
        >
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>
          <v-list-item class="text-subtitle-1 font-weight-bold">
            {{ item.text }}
          </v-list-item>
        </v-list-item>
      </v-list>
      <template #append>
        <v-list nav>
          <v-list-item
            prepend-icon="mdi-cog-outline"
            to="/site/settings"
            class="font-weight-bold text-subtitle-1"
          >
            {{ $t('app.drawer.settings') }}
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
  </ClientOnly>
</template>

<script setup>
const stateStore = useStateStore()

const items = [
  { text: '生成病例', icon: 'mdi-alpha-c-circle', link: '/cstar/case', disabled: false },
  { text: '编写故事', icon: 'mdi-alpha-s-circle', link: '/cstar/story', disabled: false },
  { text: '设计问题', icon: 'mdi-alpha-t-circle', link: '/cstar/test', disabled: true },
  { text: '模拟问诊', icon: 'mdi-alpha-a-circle', link: '/cstar/act', disabled: true },
  { text: '评估能力', icon: 'mdi-alpha-r-circle', link: '/cstar/rate', disabled: true },
  { text: '图像生成', icon: 'mdi-image-outline', link: '/image/face', disabled: false },
  { text: '视频生成', icon: 'mdi-video-outline', link: '/video/pose', disabled: true },
  { text: '语音合成', icon: 'mdi-account-tie-voice-outline', link: '/audio/voice', disabled: true },
]
</script>

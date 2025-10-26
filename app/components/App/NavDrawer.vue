<template>
  <v-navigation-drawer v-model="stateStore.isNavDrawerShow" location="left">
    <v-list v-for="(list, navIndex) in navLists" :key="navIndex" nav density="compact">
      <v-list-subheader class="font-weight-bold">{{ list.title }}</v-list-subheader>
      <v-list-item
        v-for="(item, itemIndex) in list.items"
        :key="itemIndex"
        :value="item"
        :to="item.link"
        :disabled="item.disabled"
      >
        <template #prepend>
          <v-icon :icon="item.icon" />
        </template>
        <v-list-item-title class="text-subtitle-1 font-weight-bold">
          {{ item.text }}
        </v-list-item-title>
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
</template>

<script setup>
const stateStore = useStateStore()

const projects = ref([
  {
    text: '叙事医学',
    icon: 'mdi-book-open-outline',
    link: '/project/narrative-medicine',
    disabled: false,
  },
  { text: '虚拟门诊', icon: 'mdi-account-injury', link: '/project/clinic', disabled: true },
])

const cstar = ref([
  { text: '生成病例', icon: 'mdi-alpha-c-circle', link: '/cstar/case', disabled: false },
  { text: '编写故事', icon: 'mdi-alpha-s-circle', link: '/cstar/story', disabled: false },
  { text: '设计问题', icon: 'mdi-alpha-t-circle', link: '/cstar/test', disabled: true },
  { text: '模拟问诊', icon: 'mdi-alpha-a-circle', link: '/cstar/act', disabled: true },
  { text: '评估能力', icon: 'mdi-alpha-r-circle', link: '/cstar/rate', disabled: true },
])

const multimodal = ref([
  { text: '图像生成', icon: 'mdi-image-outline', link: '/image/face', disabled: false },
  { text: '视频生成', icon: 'mdi-video-outline', link: '/video/pose', disabled: false },
  {
    text: '语音合成',
    icon: 'mdi-account-tie-voice-outline',
    link: '/audio/voice',
    disabled: false,
  },
])

const navLists = ref([
  { title: '项目', items: projects.value },
  { title: 'CSTAR', items: cstar.value },
  { title: '多模态', items: multimodal.value },
])
</script>

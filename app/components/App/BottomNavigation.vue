<template>
  <v-bottom-navigation :active="stateStore.isBottomNavigationShow" :elevation="4" grow>
    <v-btn v-for="(bottomNavList, bottomNavListIndex) in bottomNavLists" :key="bottomNavListIndex">
      <v-icon :icon="bottomNavList.icon" />
      <span>{{ bottomNavList.title }}</span>
      <v-menu activator="parent">
        <v-list class="mb-1" rounded="lg">
          <v-list-item
            v-for="(menu, menuIndex) in bottomNavList.menu"
            :key="menuIndex"
            :value="menu"
            :to="menu.link"
            :disabled="menu.disabled"
          >
            <template #prepend>
              <v-icon :icon="menu.icon" />
            </template>
            <v-list-item-title>{{ menu.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-bottom-navigation>
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

const settings = ref([
  { text: '设置', icon: 'mdi-cog-outline', link: '/site/settings', disabled: false },
])

const bottomNavLists = ref([
  { title: '项目', icon: 'mdi-cast-education', menu: projects.value },
  { title: 'CSTAR', icon: 'mdi-folder-outline', menu: cstar.value },
  { title: '多模态', icon: 'mdi-folder-outline', menu: multimodal.value },
  { title: '设置', icon: 'mdi-cog-outline', menu: settings.value },
])
</script>

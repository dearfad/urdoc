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
            slim
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
import {
  mdiBookOpenOutline,
  mdiAccountInjury,
  mdiAlphaCCircle,
  mdiAlphaSCircle,
  mdiAlphaTCircle,
  mdiAlphaACircle,
  mdiAlphaRCircle,
  mdiCastEducation,
  mdiFolderOutline,
  mdiCogOutline,
  mdiImageOutline,
  mdiVideoOutline,
  mdiAccountTieVoiceOutline,
} from '@mdi/js'
const stateStore = useStateStore()

const projects = ref([
  {
    text: '叙事医学',
    icon: mdiBookOpenOutline,
    link: '/project/narrative-medicine',
    disabled: false,
  },
  { text: '虚拟门诊', icon: mdiAccountInjury, link: '/project/clinic', disabled: true },
])

const cstar = ref([
  { text: '生成病例', icon: mdiAlphaCCircle, link: '/cstar/case', disabled: false },
  { text: '编写故事', icon: mdiAlphaSCircle, link: '/cstar/story', disabled: false },
  { text: '设计问题', icon: mdiAlphaTCircle, link: '/cstar/test', disabled: false },
  { text: '模拟问诊', icon: mdiAlphaACircle, link: '/cstar/act', disabled: false },
  { text: '评估能力', icon: mdiAlphaRCircle, link: '/cstar/rate', disabled: false },
])

const multimodal = ref([
  { text: '图像生成', icon: mdiImageOutline, link: '/image/face', disabled: false },
  { text: '视频生成', icon: mdiVideoOutline, link: '/video/pose', disabled: false },
  {
    text: '语音合成',
    icon: mdiAccountTieVoiceOutline,
    link: '/audio/voice',
    disabled: false,
  },
])

const settings = ref([
  { text: '设置', icon: mdiCogOutline, link: '/site/settings', disabled: false },
])

const bottomNavLists = ref([
  { title: '项目', icon: mdiCastEducation, menu: projects.value },
  { title: 'CSTAR', icon: mdiFolderOutline, menu: cstar.value },
  { title: '多模态', icon: mdiFolderOutline, menu: multimodal.value },
  { title: '设置', icon: mdiCogOutline, menu: settings.value },
])
</script>

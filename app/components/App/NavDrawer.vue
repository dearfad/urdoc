<template>
  <ClientOnly>
    <v-navigation-drawer
      v-model="stateStore.isNavDrawerShow"
      location="left"
      disable-resize-watcher
    >
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
            :prepend-icon="mdiCogOutline"
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
import {
  mdiBookOpenOutline,
  mdiAccountInjury,
  mdiAlphaCCircle,
  mdiAlphaSCircle,
  mdiAlphaTCircle,
  mdiAlphaACircle,
  mdiAlphaRCircle,
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

const navLists = ref([
  { title: '项目', items: projects.value },
  { title: 'CSTAR', items: cstar.value },
  { title: '多模态', items: multimodal.value },
])
</script>

<template>
  <UDashboardSidebar id="default" collapsible resizable>
    <template #header="{ collapsed }">
      <AppLogo class="h-8 w-auto shrink-0" />
      <NuxtLink :to="localePath('/')">
        <span v-if="!collapsed" class="text-xl font-bold">URDOC</span>
      </NuxtLink>
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu :collapsed="collapsed" :items="items" orientation="vertical" tooltip popover />
    </template>

    <template #footer="{ collapsed }">
      <UButton
        :label="collapsed ? '' : t('sidebar.login')"
        icon="i-lucide-user"
        :to="localePath('/user')"
        color="neutral"
        variant="ghost"
        class="w-full text-base font-bold"
      />
      <UButton
        :label="collapsed ? '' : t('sidebar.settings')"
        icon="i-lucide-settings"
        :to="localePath('/settings')"
        color="neutral"
        variant="ghost"
        class="w-full text-base font-bold"
      />
    </template>
  </UDashboardSidebar>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { generateDocSidebarItems } from '~/utils/docs'

const { t } = useI18n()
const localePath = useLocalePath()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: t('sidebar.overview'),
    icon: 'i-lucide-layout-dashboard',
    to: localePath('/dashboard'),
  },
  {
    label: t('sidebar.projects'),
    icon: 'i-lucide-book',
    defaultOpen: true,
    children: [
      {
        label: t('sidebar.narrativeMedicine'),
        icon: 'i-lucide-book-plus',
        to: localePath('/project/narrative-medicine'),
        class: 'font-bold text-base',
      },
      {
        label: t('sidebar.clinicalSimulation'),
        icon: 'i-lucide-stethoscope',
        to: localePath('/project/clinical-simulation'),
        class: 'font-bold text-base',
      },
      {
        label: t('sidebar.pedagogicalResearch'),
        icon: 'i-lucide-graduation-cap',
        to: localePath('/project/pedagogical-research'),
        class: 'font-bold text-base',
      },
    ],
  },
  {
    label: t('sidebar.cstar'),
    icon: 'i-lucide-circle-star',
    defaultOpen: true,
    children: [
      {
        label: t('sidebar.generateCase'),
        icon: 'i-mdi-alpha-c-circle',
        to: localePath('/cstar/case'),
        class: 'font-bold text-base',
      },
      {
        label: t('sidebar.writeStory'),
        icon: 'i-mdi-alpha-s-circle',
        to: localePath('/cstar/story'),
        class: 'font-bold text-base',
      },
      {
        label: t('sidebar.testTheory'),
        icon: 'i-mdi-alpha-t-circle',
        to: localePath('/cstar/test'),
        class: 'font-bold text-base',
      },
      {
        label: t('sidebar.interactivePractice'),
        icon: 'i-mdi-alpha-a-circle',
        to: localePath('/cstar/act'),
        class: 'font-bold text-base',
      },
      {
        label: t('sidebar.evaluateAbility'),
        icon: 'i-mdi-alpha-r-circle',
        to: localePath('/cstar/rate'),
        class: 'font-bold text-base',
      },
    ],
  },
  {
    label: t('sidebar.multimodal'),
    icon: 'i-lucide-file-stack',
    defaultOpen: true,
    children: [
      {
        label: t('sidebar.imageCreation'),
        icon: 'i-lucide-image',
        to: localePath('/multimodal/image'),
        class: 'font-bold text-base',
      },
      {
        label: t('sidebar.videoRendering'),
        icon: 'i-lucide-video',
        to: localePath('/multimodal/video'),
        class: 'font-bold text-base',
      },
      {
        label: t('sidebar.audioSynthesis'),
        icon: 'i-lucide-audio-lines',
        to: localePath('/multimodal/audio'),
        class: 'font-bold text-base',
      },
    ],
  },
  {
    label: t('sidebar.docs'),
    icon: 'i-lucide-book-open-text',
    defaultOpen: false,
    children: generateDocSidebarItems(),
  },
])
</script>

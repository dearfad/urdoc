import type { NavigationMenuItem } from '@nuxt/ui'

/**
 * 子项目入口元数据。
 * path 为不含语言前缀的路由，渲染时统一经 localePath() 处理。
 */
export interface ProjectEntry {
  slug: string
  path: string
  labelKey: string
  descriptionKey: string
  icon: string
  badgeKey?: string
}

/** 项目及其子项目清单 */
export interface ProjectGroup extends ProjectEntry {
  children: ProjectEntry[]
}

const generationBadge = 'projectPage.common.available'
const placeholderBadge = 'projectPage.common.comingSoon'

/** 项目模块元数据单一来源：卡片网格与侧边栏共用 */
export const projectGroups: ProjectGroup[] = [
  {
    slug: 'narrative-medicine',
    path: '/project/narrative-medicine',
    labelKey: 'sidebar.narrativeMedicine',
    descriptionKey: 'projectPage.narrativeMedicine.description',
    icon: 'i-lucide-book-plus',
    children: [
      {
        slug: 'narrative-generation',
        path: '/project/narrative-medicine/narrative-generation',
        labelKey: 'projectPage.narrativeMedicine.narrativeGeneration.title',
        descriptionKey: 'projectPage.narrativeMedicine.narrativeGeneration.description',
        icon: 'i-lucide-sparkles',
        badgeKey: generationBadge,
      },
    ],
  },
  {
    slug: 'clinical-simulation',
    path: '/project/clinical-simulation',
    labelKey: 'sidebar.clinicalSimulation',
    descriptionKey: 'projectPage.clinicalSimulation.description',
    icon: 'i-lucide-stethoscope',
    children: [
      {
        slug: 'higher-education-reform-research',
        path: '/project/clinical-simulation/higher-education-reform-research',
        labelKey: 'projectPage.clinicalSimulation.higherEducationReformResearch.title',
        descriptionKey: 'projectPage.clinicalSimulation.higherEducationReformResearch.description',
        icon: 'i-lucide-school',
        badgeKey: placeholderBadge,
      },
    ],
  },
  {
    slug: 'pedagogical-research',
    path: '/project/pedagogical-research',
    labelKey: 'sidebar.pedagogicalResearch',
    descriptionKey: 'projectPage.pedagogicalResearch.description',
    icon: 'i-lucide-graduation-cap',
    children: [
      {
        slug: 'model-selection',
        path: '/project/pedagogical-research/model-selection',
        labelKey: 'projectPage.pedagogicalResearch.modelSelection.title',
        descriptionKey: 'projectPage.pedagogicalResearch.modelSelection.description',
        icon: 'i-lucide-brain-circuit',
        badgeKey: placeholderBadge,
      },
    ],
  },
]

/** 按 slug 查找项目，供项目首页读取元数据 */
export function findProjectGroup(slug: string): ProjectGroup | undefined {
  return projectGroups.find((group) => group.slug === slug)
}

/**
 * 生成侧边栏项目菜单，父项指向项目总览，每个项目展开到子项目。
 * t 与 localePath 由页面 setup 注入，避免 utils 直接依赖 composable 上下文。
 */
export function generateProjectSidebarItems(
  t: (key: string) => string,
  localePath: (path: string) => string
): NavigationMenuItem[] {
  return [
    {
      label: t('sidebar.projects'),
      icon: 'i-lucide-book',
      to: localePath('/project'),
      defaultOpen: true,
      children: projectGroups.map((group) => ({
        label: t(group.labelKey),
        icon: group.icon,
        to: localePath(group.path),
        class: 'font-bold text-base',
        trailingIcon: 'i-lucide-plus',
        ui: { linkTrailingIcon: 'group-data-[state=open]:rotate-45' },
        children: group.children.map((child) => ({
          label: t(child.labelKey),
          icon: child.icon,
          to: localePath(child.path),
        })),
      })),
    },
  ]
}

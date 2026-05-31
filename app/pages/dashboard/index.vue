<template>
  <UDashboardPanel id="pages-dashboard-index">
    <template #header>
      <UDashboardNavbar title="概览">
        <template #leading>
          <UTooltip text="侧边栏">
            <UDashboardSidebarCollapse />
          </UTooltip>
        </template>
        <template #right>
          <AppHeader />
        </template>
      </UDashboardNavbar>
      <!-- <UDashboardToolbar>
        <UBreadcrumb :items="items" />
      </UDashboardToolbar> -->
    </template>
    <template #body>
      <div class="divide-border-muted divide-y">
        <!-- Hero -->
        <div class="px-6 py-10 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <h1 class="text-highlighted text-4xl font-bold tracking-tight">URDOC</h1>
            <p class="text-muted mt-2 text-xl">虚拟病例研究平台</p>
            <p class="text-default mt-4 leading-relaxed">
              基于大语言模型驱动的 AI 能力，面向医学教育领域，围绕
              <strong class="text-highlighted">CSTAR</strong>
              教学框架，提供从病例生成、叙事写作、考核出题到模拟问诊的全流程工具。
            </p>
          </div>
        </div>

        <!-- CSTAR 框架 -->
        <div class="px-6 py-8 lg:px-8">
          <h2 class="text-highlighted mb-2 text-lg font-semibold">CSTAR 教学框架</h2>
          <p class="text-muted mb-6 text-sm">核心教学实践闭环，覆盖医学教育的完整链条</p>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <UCard
              v-for="item in cstarItems"
              :key="item.label"
              variant="outline"
              class="cursor-pointer"
              @click="navigateTo(item.to)"
              :ui="{
                base: 'h-full',
                body: 'flex flex-col items-center text-center gap-3 p-6',
                header: 'p-0',
                footer: 'p-0',
              }"
            >
              <UIcon :name="item.icon" class="text-primary size-8" />
              <h3 class="text-highlighted font-semibold">{{ item.label }}</h3>
              <p class="text-muted text-sm leading-relaxed">{{ item.description }}</p>
            </UCard>
          </div>
        </div>

        <!-- 多模态工具 -->
        <div class="px-6 py-8 lg:px-8">
          <h2 class="text-highlighted mb-2 text-lg font-semibold">多模态工具</h2>
          <p class="text-muted mb-6 text-sm">拓展医学教育的表达维度</p>
          <div class="grid gap-4 sm:grid-cols-3">
            <UCard
              v-for="item in multimodalItems"
              :key="item.label"
              variant="outline"
              class="cursor-pointer"
              @click="navigateTo(item.to)"
              :ui="{
                base: 'h-full',
                body: 'flex items-center gap-4 p-5',
                header: 'p-0',
                footer: 'p-0',
              }"
            >
              <UIcon :name="item.icon" class="text-primary size-6 shrink-0" />
              <div>
                <h3 class="text-highlighted font-semibold">{{ item.label }}</h3>
                <p class="text-muted text-sm">{{ item.description }}</p>
              </div>
            </UCard>
          </div>
        </div>

        <!-- 使用流程 -->
        <div class="px-6 py-8 lg:px-8">
          <h2 class="text-highlighted mb-2 text-lg font-semibold">使用流程</h2>
          <p class="text-muted mb-6 text-sm">从病例生成到互动实践的典型路径</p>
          <div class="flex flex-wrap items-center justify-center gap-2 text-sm">
            <template v-for="(step, i) in workflowSteps" :key="step">
              <UBadge
                :color="i === workflowSteps.length - 1 ? 'primary' : 'neutral'"
                variant="soft"
                size="lg"
                class="px-3 py-1.5"
              >
                {{ i + 1 }}. {{ step }}
              </UBadge>
              <UIcon v-if="i < workflowSteps.length - 1" name="i-lucide-arrow-right" class="text-muted size-4" />
            </template>
          </div>
        </div>

        <!-- 部署状态与快捷操作 -->
        <div class="px-6 py-8 lg:px-8">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="space-y-3">
              <h2 class="text-highlighted text-lg font-semibold">部署状态</h2>
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <UBadge
                    :label="lastCommitDate.main || '--'"
                    color="success"
                    variant="soft"
                    class="font-mono text-xs"
                  />
                  <span class="text-muted text-sm"
                    >正式站：<a href="https://urdoc.dearfad.com" target="_blank" class="text-primary hover:underline"
                      >urdoc.dearfad.com</a
                    ></span
                  >
                </div>
                <div class="flex items-center gap-3">
                  <UBadge
                    :label="lastCommitDate.develop || '--'"
                    color="warning"
                    variant="soft"
                    class="font-mono text-xs"
                  />
                  <span class="text-muted text-sm"
                    >开发站：<a
                      href="https://dev.urdoc.dearfad.com"
                      target="_blank"
                      class="text-primary hover:underline"
                      >dev.urdoc.dearfad.com</a
                    ></span
                  >
                </div>
                <div class="flex items-center gap-3">
                  <UBadge label="最新" color="info" variant="soft" class="font-mono text-xs" />
                  <span class="text-muted text-sm"
                    >文档：<NuxtLink to="/docs" class="text-primary hover:underline">应用内文档中心</NuxtLink></span
                  >
                </div>
              </div>
              <UButton
                label="刷新状态"
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-lucide-refresh-cw"
                @click="getLastCommitDateAll"
              />
            </div>
            <UButton
              label="开始生成病例"
              size="xl"
              to="/cstar/case"
              icon="i-lucide-arrow-right"
              trailing
              class="shrink-0"
            />
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const cstarItems = [
  {
    label: '生成病例',
    icon: 'i-lucide-file-text',
    description: 'AI 自动生成符合执业医师考试标准的完整结构化病例',
    to: '/cstar/case',
  },
  {
    label: '编写故事',
    icon: 'i-lucide-book-open',
    description: '基于病例创作医疗叙事故事，体现叙事医学理念',
    to: '/cstar/story',
  },
  {
    label: '考核理论',
    icon: 'i-lucide-clipboard-check',
    description: '根据病例自动生成符合考试要求的选择题',
    to: '/cstar/test',
  },
  {
    label: '互动实践',
    icon: 'i-lucide-message-square',
    description: 'AI 模拟患者角色，进行逼真的临床问诊训练',
    to: '/cstar/act',
  },
  {
    label: '评估能力',
    icon: 'i-lucide-bar-chart-3',
    description: '多维度评估临床能力，持续追踪学习进度',
    to: '/cstar/rate',
  },
]

const workflowSteps = ['生成病例', '编写故事', '考核理论', '互动实践']

const multimodalItems = [
  { label: '图像创作', icon: 'i-lucide-image', description: 'AI 生成医学相关图像', to: '/multimodal/image' },
  { label: '视频渲染', icon: 'i-lucide-video', description: '姿态与动作相关视频生成', to: '/multimodal/video' },
  { label: '语音合成', icon: 'i-lucide-volume-2', description: 'AI 语音对话生成', to: '/multimodal/speech' },
]

const lastCommitDate = ref({
  main: '',
  develop: '',
})

async function getLastCommitDate(branch: string): Promise<string> {
  return await $fetch('/api/github/commit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      branch: branch,
    },
  })
}

async function getLastCommitDateAll() {
  lastCommitDate.value.main = await getLastCommitDate('main')
  lastCommitDate.value.develop = await getLastCommitDate('develop')
}
</script>

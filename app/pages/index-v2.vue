<template>
  <!-- 固定顶部导航 -->
  <header
    :class="[
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      isScrolled
        ? 'bg-default/80 backdrop-blur-md border-b border-default shadow-xs'
        : 'bg-transparent',
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2.5 shrink-0">
        <AppLogo class="h-7 w-auto" />
        <span class="font-bold text-lg tracking-tight text-default">URDOC</span>
      </NuxtLink>

      <UNavigationMenu
        :items="navItems"
        class="hidden md:flex"
        :ui="{
          trigger: isScrolled ? '' : '',
          item: isScrolled ? '' : 'text-default/80 hover:text-default',
        }"
      />

      <div class="flex items-center gap-1.5">
        <UColorModeButton
          :color="isScrolled ? 'neutral' : 'neutral'"
          :variant="isScrolled ? 'ghost' : 'ghost'"
        />
        <UButton
          label="登录"
          to="/dashboard"
          color="primary"
          variant="ghost"
          size="sm"
          class="hidden sm:inline-flex"
        />
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          size="sm"
          class="md:hidden"
          @click="mobileOpen = !mobileOpen"
        />
      </div>
    </div>

    <!-- 移动端菜单 -->
    <Transition name="mobile-nav">
      <div
        v-if="mobileOpen"
        class="md:hidden border-t border-default bg-default px-6 py-4"
      >
        <UNavigationMenu
          :items="navItems"
          orientation="vertical"
          class="-mx-2.5"
        />
      </div>
    </Transition>
  </header>

  <!-- ============== HERO ============== -->
  <section class="bg-[#1e3a5f] dark:bg-[#1e3a5f] pt-28 pb-20 md:pt-36 md:pb-28">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center max-w-4xl mx-auto">
        <p
          class="text-blue-200/80 uppercase tracking-[0.2em] text-xs md:text-sm font-medium mb-5 animate-fade-in-up"
        >
          CSTAR &middot; 医学教育创新平台
        </p>
        <h1
          class="text-white font-bold text-4xl md:text-5xl lg:text-6xl/none tracking-tight mb-6 animate-fade-in-up delay-100"
        >
          虚拟病例研究平台
        </h1>
        <p
          class="text-blue-100/70 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-10 animate-fade-in-up delay-200"
        >
          基于大语言模型的医学教育创新平台 &mdash;&mdash;
          从病例生成到能力评估，AI 驱动的 CSTAR 全流程闭环
        </p>

        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300"
        >
          <UButton
            label="开始使用"
            to="/dashboard"
            color="primary"
            size="lg"
            icon="i-lucide-square-play"
            class="w-full sm:w-auto"
          />
          <UButton
            label="查阅文档"
            to="https://docs.urdoc.dearfad.com"
            color="neutral"
            variant="outline"
            size="lg"
            trailing-icon="i-lucide-arrow-right"
            class="w-full sm:w-auto text-white/90 border-white/20 hover:border-white/40 hover:bg-white/10"
          />
        </div>
      </div>

      <!-- Hero 统计数据 -->
      <div
        class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-16 md:mt-20 max-w-3xl mx-auto animate-fade-in-up delay-400"
      >
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="text-center"
        >
          <div class="text-3xl md:text-4xl font-bold text-white mb-1 tabular-nums">
            <CountUp :target="stat.value" :suffix="stat.suffix ?? '+'" />
          </div>
          <div class="text-xs md:text-sm text-blue-200/70">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============== CSTAR 核心模块 ============== -->
  <section class="py-20 md:py-28 animate-fade-in-up">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-14 md:mb-16">
        <p class="text-primary font-semibold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
          CSTAR 核心模块
        </p>
        <h2 class="text-3xl md:text-4xl font-bold text-default tracking-tight mb-4">
          覆盖医学教育全场景
        </h2>
        <p class="text-muted text-base md:text-lg max-w-2xl mx-auto">
          五大模块环环相扣，从病例生成到能力评估构建完整的教学闭环
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UCard
          v-for="(feature, idx) in features"
          :key="feature.title"
          class="group hover:shadow-lg transition-all duration-300 animate-fade-in-up"
          :style="{ animationDelay: `${idx * 100 + 100}ms` }"
          :ui="{ body: 'p-6', root: 'border-default' }"
        >
          <div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
            <UIcon :name="feature.icon" class="size-6 text-primary" />
          </div>
          <h3 class="font-semibold text-lg text-default mb-2">{{ feature.title }}</h3>
          <p class="text-muted text-sm leading-relaxed">{{ feature.description }}</p>
        </UCard>
      </div>
    </div>
  </section>

  <!-- ============== 统计数据 ============== -->
  <section class="py-20 md:py-24 bg-muted animate-fade-in-up">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-14">
        <p class="text-primary font-semibold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
          平台数据
        </p>
        <h2 class="text-3xl md:text-4xl font-bold text-default tracking-tight mb-4">
          用数据说话
        </h2>
        <p class="text-muted text-base md:text-lg max-w-2xl mx-auto">
          持续增长的学术社区与病例资源库
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        <div
          v-for="(item, idx) in metrics"
          :key="item.label"
          class="text-center animate-fade-in-up"
          :style="{ animationDelay: `${idx * 100 + 100}ms` }"
        >
          <div class="text-4xl md:text-5xl font-bold text-primary tabular-nums mb-2">
            <CountUp :target="item.value" :suffix="item.suffix ?? ''" />
          </div>
          <div class="text-sm text-muted">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============== 最新动态 ============== -->
  <section class="py-20 md:py-28 animate-fade-in-up">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
        <div>
          <p class="text-primary font-semibold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
            最新动态
          </p>
          <h2 class="text-3xl md:text-4xl font-bold text-default tracking-tight">
            学术资讯
          </h2>
        </div>
        <UButton
          label="查看全部"
          to="https://docs.urdoc.dearfad.com"
          color="neutral"
          variant="ghost"
          trailing-icon="i-lucide-arrow-right"
          size="sm"
        />
      </div>

      <div class="divide-y divide-default">
        <div
          v-for="(update, idx) in updates"
          :key="update.title"
          class="py-5 md:py-6 flex flex-col md:flex-row md:items-center gap-3 md:gap-8 animate-fade-in-up"
          :style="{ animationDelay: `${idx * 100}ms` }"
        >
          <span class="text-xs text-muted font-mono shrink-0">{{ update.date }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-default font-medium truncate">{{ update.title }}</p>
            <p v-if="update.description" class="text-muted text-sm mt-0.5 line-clamp-1">
              {{ update.description }}
            </p>
          </div>
          <UIcon
            name="i-lucide-arrow-up-right"
            class="size-4 text-muted shrink-0 hidden md:block"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- ============== 页脚 ============== -->
  <footer class="bg-[#1e3a5f] dark:bg-[#1e3a5f] pt-14 pb-8">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid md:grid-cols-3 gap-10 md:gap-16 pb-12 border-b border-white/10">
        <div>
          <div class="flex items-center gap-2.5 mb-4">
            <AppLogo class="h-7 w-auto brightness-0 invert" />
            <span class="font-bold text-lg text-white tracking-tight">URDOC</span>
          </div>
          <p class="text-blue-200/60 text-sm leading-relaxed max-w-xs">
            基于大语言模型的医学教育创新平台，致力于为医学教育提供智能化解决方案。
          </p>
        </div>
        <div>
          <h4 class="text-white font-semibold text-sm uppercase tracking-wider mb-4">功能导航</h4>
          <ul class="space-y-2.5">
            <li v-for="link in footerLinks" :key="link.label">
              <NuxtLink
                :to="link.to"
                class="text-blue-200/60 hover:text-white text-sm transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold text-sm uppercase tracking-wider mb-4">联系方式</h4>
          <ul class="space-y-2.5 text-blue-200/60 text-sm">
            <li>邮箱：contact@urdoc.dearfad.com</li>
            <li>
              <UButton
                icon="i-simple-icons-github"
                color="neutral"
                variant="ghost"
                to="https://github.com/dearfad/urdoc"
                target="_blank"
                size="sm"
                class="text-blue-200/60 hover:text-white -ml-2"
              >
                GitHub
              </UButton>
            </li>
          </ul>
        </div>
      </div>
      <div class="pt-6 text-center text-blue-200/40 text-xs">
        &copy; {{ new Date().getFullYear() }} URDOC. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

definePageMeta({
  layout: 'landing',
})

// ---------- 导航 ----------
const isScrolled = ref(false)
const mobileOpen = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

const navItems: NavigationMenuItem[] = [
  { label: '首页', to: '/' },
  { label: 'CSTAR', to: '/dashboard' },
  { label: '文档', to: 'https://docs.urdoc.dearfad.com' },
]

// ---------- Hero 统计数据 ----------
const stats = [
  { label: '结构化病例', value: 500 },
  { label: '合作机构', value: 50 },
  { label: '医学用户', value: 10000 },
  { label: '用户满意度', value: 98, suffix: '%' },
]

// ---------- CSTAR 核心模块 ----------
const features = [
  {
    icon: 'i-lucide-notebook-pen',
    title: 'AI 病例生成',
    description: '根据教学需求自动生成结构化病例，包含主诉、现病史、诊断等完整信息',
  },
  {
    icon: 'i-lucide-book-open',
    title: '叙事医学故事',
    description: '将病例转化为叙事医学故事，增强人文关怀与临床思维的融合训练',
  },
  {
    icon: 'i-lucide-message-square',
    title: '互动问诊模拟',
    description: '模拟真实问诊场景，与 AI 患者进行对话式临床实践训练',
  },
  {
    icon: 'i-lucide-bar-chart-3',
    title: '能力评估报告',
    description: '多维度评估临床能力，生成个性化学习建议与能力分析报告',
  },
]

// ---------- 平台数据 ----------
const metrics = [
  { label: '病例库总量', value: 500, suffix: '+' },
  { label: '合作院校', value: 50, suffix: '+' },
  { label: '活跃用户', value: 10000, suffix: '+' },
  { label: '评估报告', value: 30000, suffix: '+' },
]

// ---------- 最新动态 ----------
const updates = [
  {
    date: '2025.12',
    title: 'URDOC v2.0 正式发布，新增多模态支持',
    description: '集成图像创作、视频渲染与语音合成能力，拓展医学教育多维呈现',
  },
  {
    date: '2025.11',
    title: 'CSTAR 教学模式获医学教育创新奖',
    description: '基于 AI 的病例教学与评估模式获得业界高度认可',
  },
  {
    date: '2025.10',
    title: '与多家医学院达成战略合作',
    description: '共同推进 AI 辅助医学教学的标准化与规模化应用',
  },
]

// ---------- 页脚链接 ----------
const footerLinks = [
  { label: 'CSTAR 概览', to: '/dashboard' },
  { label: '生成病例', to: '/cstar/case' },
  { label: '编写故事', to: '/cstar/story' },
  { label: '考核理论', to: '/cstar/test' },
  { label: '互动实践', to: '/cstar/act' },
  { label: '评估能力', to: '/cstar/rate' },
]

// ---------- 计数动画 ----------
function useCountUp(target: number) {
  const count = ref(0)
  const elRef = ref<HTMLElement | null>(null)

  let observer: IntersectionObserver | null = null
  let started = false

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true
          animate()
          observer?.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    if (elRef.value) {
      observer.observe(elRef.value)
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  function animate() {
    const duration = 1800
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      count.value = Math.round(eased * target)
      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }

  return { count, elRef }
}

const CountUp = defineComponent({
  props: {
    target: { type: Number, required: true },
    suffix: { type: String, default: '' },
  },
  setup(props) {
    const { count, elRef } = useCountUp(props.target)
    return () => h('span', { ref: elRef }, `${count.value}${props.suffix}`)
  },
})
</script>

<style scoped>
/* ---------- 淡入上移动画 ---------- */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.7s ease-out both;
}

.delay-100 {
  animation-delay: 0.1s;
}
.delay-200 {
  animation-delay: 0.2s;
}
.delay-300 {
  animation-delay: 0.3s;
}
.delay-400 {
  animation-delay: 0.4s;
}

/* ---------- 移动端导航过渡 ---------- */
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: all 0.25s ease;
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.mobile-nav-enter-to,
.mobile-nav-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>

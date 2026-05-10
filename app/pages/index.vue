<template>
  <div class="relative min-h-screen overflow-hidden bg-[#09090b] selection:bg-teal-500/20">
    <!-- 环境光晕 -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.12]"
      style="background-image:
        radial-gradient(ellipse 60% 45% at 50% 50%, rgba(45,212,191,0.35) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 20% 20%, rgba(6,182,212,0.12) 0%, transparent 50%),
        radial-gradient(ellipse 60% 50% at 80% 80%, rgba(16,185,129,0.1) 0%, transparent 50%)"
    />

    <!-- 精密微点网格 -->
    <div
      class="pointer-events-none absolute inset-0 opacity-20"
      style="background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
        background-size: 32px 32px;
        mask-image: radial-gradient(ellipse 65% 55% at 50% 50%, black 55%, transparent 100%);
        -webkit-mask-image: radial-gradient(ellipse 65% 55% at 50% 50%, black 55%, transparent 100%)"
    />

    <!-- 光学镜头同心环 -->
    <div class="pointer-events-none absolute top-1/2 left-1/2 size-[80vmin] animate-ring-rotate rounded-full border border-zinc-800/15">
      <div class="absolute inset-[12%] rounded-full border border-zinc-800/10" />
      <div class="absolute inset-[26%] rounded-full border border-zinc-800/8" />
      <div class="absolute inset-[42%] rounded-full border border-zinc-700/5" />
      <div class="absolute inset-[58%] rounded-full bg-gradient-to-br from-teal-500/8 via-emerald-500/4 to-cyan-500/8 blur-2xl" />
    </div>

    <!-- 浮动粒子 -->
    <span class="pointer-events-none absolute left-[18%] top-[22%] size-[3px] animate-float rounded-full bg-teal-400/30" style="animation-delay: 0s" />
    <span class="pointer-events-none absolute right-[15%] top-[35%] size-[2px] animate-float rounded-full bg-teal-400/25" style="animation-delay: 1.2s" />
    <span class="pointer-events-none absolute bottom-[28%] left-[12%] size-[3px] animate-float rounded-full bg-emerald-400/20" style="animation-delay: 2.5s" />
    <span class="pointer-events-none absolute right-[22%] bottom-[20%] size-[2px] animate-float rounded-full bg-cyan-400/25" style="animation-delay: 3.8s" />
    <span class="pointer-events-none absolute left-[45%] top-[12%] size-[1.5px] animate-float rounded-full bg-teal-400/20" style="animation-delay: 0.8s" />
    <span class="pointer-events-none absolute right-[40%] bottom-[15%] size-[2.5px] animate-float rounded-full bg-emerald-400/25" style="animation-delay: 2s" />

    <!-- 内容层 -->
    <div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <!-- 顶部标识 -->
      <div
        class="animate-reveal flex items-center gap-3 rounded-full border border-zinc-800/60 bg-zinc-900/70 px-5 py-2 text-[11px] font-medium tracking-[0.25em] uppercase text-zinc-400 shadow-sm backdrop-blur-md"
        style="animation-delay: 0.1s; animation-fill-mode: both;"
      >
        <span class="flex items-center gap-2">
          <span class="size-[5px] animate-pulse rounded-full bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.6)]" />
          URDOC
        </span>
        <span class="text-zinc-700">·</span>
        <span class="text-zinc-500">CSTAR</span>
      </div>

      <!-- 主标题 -->
      <h1
        class="mt-14 max-w-4xl animate-reveal"
        style="animation-delay: 0.2s; animation-fill-mode: both;"
      >
        <span class="block text-5xl font-bold leading-[1.1] tracking-tight text-zinc-100 sm:text-6xl lg:text-7xl xl:text-8xl [text-wrap:balance]">
          虚拟病例研究平台
        </span>
        <span class="mt-5 block text-sm font-light tracking-[0.3em] text-zinc-500/80 sm:text-base">
          Virtual Case Study &amp; Research Platform
        </span>
      </h1>

      <!-- 描述 -->
      <p
        class="mt-8 max-w-2xl animate-reveal text-base font-light leading-relaxed text-zinc-400/90 sm:text-lg [text-wrap:balance]"
        style="animation-delay: 0.35s; animation-fill-mode: both;"
      >
        通过大语言模型生成病例、编写故事、设计问题、模拟问诊、评估能力，CSTAR模式的应用与创新实践
      </p>

      <!-- 流光分隔线 -->
      <div
        class="relative mt-12 h-px w-24 animate-reveal overflow-hidden rounded-full bg-zinc-800"
        style="animation-delay: 0.5s; animation-fill-mode: both;"
      >
        <div class="absolute inset-0 w-1/2 animate-shimmer rounded-full bg-gradient-to-r from-transparent to-teal-400/60" />
      </div>

      <!-- 行动按钮 -->
      <div
        class="mt-10 flex animate-reveal flex-wrap items-center justify-center gap-4"
        style="animation-delay: 0.65s; animation-fill-mode: both;"
      >
        <UButton v-for="link in links" :key="link.label" v-bind="link" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

definePageMeta({
  layout: 'landing',
})

const links = ref<ButtonProps[]>([
  {
    label: '开始',
    to: '/dashboard',
    icon: 'i-lucide-square-play',
  },
  {
    label: '文档',
    to: 'https://docs.urdoc.dearfad.com',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: 'i-lucide-arrow-right',
  },
])
</script>

<style scoped>
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-20px) translateX(8px);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-8px) translateX(-6px);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-28px) translateX(4px);
    opacity: 0.6;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

@keyframes ring-rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.animate-reveal {
  animation: reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-shimmer {
  animation: shimmer 3s ease-in-out infinite;
}

.animate-ring-rotate {
  animation: ring-rotate 180s linear infinite;
}
</style>
